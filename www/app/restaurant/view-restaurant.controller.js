app.controller("ViewRestaurantCtrl", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "Database", "$ionicLoading", "$ionicModal", "$ionicPopup", "CordovaGeolocation", "$stateParams", "Restaurant", "User", "Review", "Reservation", "$ionicLoading",
  function($scope, $state, $firebaseArray, $firebaseObject, Database, $ionicLoading, $ionicModal, $ionicPopup, CordovaGeolocation, $stateParams, Restaurant, User, Review, Reservation, $ionicLoading) {

    console.log("View Restaurant Ctrl")

    $scope.rating = {
      rate: 0,
      max: 5
    }

    var id = $stateParams.restaurantId;
    var userReviewsRef = Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id); //new subs below
    var restaurantReviewsRef = Database.reviewsReference().orderByChild('restaurant_id').equalTo(id); //new subs above
    $scope.getReviewer = Review.reviewer;
    $scope.restaurant = Restaurant.get(id);

    $scope.restaurantStatus = Restaurant.getRestaurantStatus(Restaurant.get(id).owner_id);

    $scope.isAlreadyReviewed = function() {
      userReviewsRef.once('value', function(snapshot) {
        $scope.exists = snapshot.val();
        $scope.review = $firebaseObject(Database.reviewsReference().child(snapshot.val()));
        $scope.review.$loaded().then(function() {
          $scope.reviewId = $scope.review.$id;
       });
      })
    }



    $scope.restaurantStatus.on('value', function(snap) {
      $scope.getRestaurantStatus = snap.val() ? "Online" : "Offline";
    })

    $scope.bookReservation = function(reservation) {
      $ionicLoading.show();
      var reservationObject = {
        datetime: reservation.datetime.getTime(),
        number_of_persons: reservation.number_of_persons,
        status: 'pending',
        user_id: User.auth().$id,
        restaurant_id: id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }
      Reservation.create(reservationObject);
      $scope.addReservationModal.hide();
    }


    $scope.showAddReservationModal = function() {
      $scope.reservation = {
        datetime: new Date(),
        number_of_persons: 2,
      }
      $scope.addReservationModal.show();
    }

    $scope.restaurantOpenStatus = Restaurant.getRestaurantOpenStatus(id)
    $scope.isAlreadyReviewed();
    $scope.restaurantReviews = $firebaseArray(restaurantReviewsRef);

    $scope.images = [];
    var metadata = {
      contentType: 'image/jpeg',
    };
    $scope.selImages = function() {
      window.imagePicker.getPictures(
        function(results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            window.plugins.Base64.encodeFile(results[i], function(base64) {
              var d = new Date();
              var child = 'reviews/' + d.getTime() + '.jpg';
              var storageRef = firebase.storage().ref();
              var reviewsRef = storageRef.child(child).putString(base64, 'data_url', metadata);
              reviewsRef.on('state_changed', function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                // $scope.progress = progress;
              }, function(error) {
                console.log("error in uploading." + error);
              }, function() {
                var downloadURL = reviewsRef.snapshot.downloadURL;
                $scope.images.push(downloadURL);
                $scope.$apply();
              });
            });
          }
        },
        function(error) {
          console.log('Error: ' + error);
        }, {
          maximumImagesCount: 10,
          width: 400,
          quality: 20
        }
      );
    };

    $scope.addReview = function(review) {
      $ionicLoading.show();
      console.log("wewewe");
      var reviewRating = review.rating;
      Database.reviews().$add({
        content: review.content,
        rating: review.rating,
        prevRating: review.rating,
        reviewer_id: User.auth().$id,
        restaurant_id: id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(function(review) {
        $ionicLoading.hide();
        var newImages = Database.reviewsReference().child(review.key).child('images');
        var list = $firebaseArray(newImages);
        for (var i = 0; i < $scope.images.length; i++) {
          list.$add({
            image: $scope.images[i]
          }).then(function(ref) {
            console.log("added..." + ref);
          });
        }
        console.log("add review done");
        Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id).set(review.key);
        // Database.restaurantsReference().child(id).child('reviews').child(review.key).set(true); //new
        // Database.restaurantsReference().child(id).child('reviewers').child(User.auth().$id).set(true); //new
        $scope.isAlreadyReviewed();
        $scope.reviewModal.hide();
        review.content = '';
        $scope.review.rating = 0;
        $scope.rating.rate = 0;
        $scope.images = [];
        $ionicLoading.hide();
      })
      var restaurant_owner = Restaurant.getOwner(id);
      Database.notifications().$add({
        sender_id: User.auth().$id,
        receiver_id: restaurant_owner.$id,
        restaurant_id: id,
        type: 'review',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(function() {
        console.log("hello notification squad");
        $ionicLoading.hide();
      })
    }

    $scope.openEditModal = function() {
      console.log("open edit modal");
      $scope.editReviewModal.show();
      var images = Database.reviewsReference().child($scope.reviewId).child('images');
      $scope.editImages = $firebaseArray(images);
    }

    $scope.updateReview = function(review) {
      var reviewRef = Database.reviewsReference().child(review.$id);
      var reviewRating = review.rating;
      reviewRef.update({
        content: review.content,
        rating: review.rating
      }).then(function() {
        console.log($scope.images)
        console.log("finished updating review.");
        var newImages = Database.reviewsReference().child(review.$id).child('images');
        var list = $firebaseArray(newImages);
        for (var i = 0; i < $scope.images.length; i++) {
          list.$add({ image: $scope.images[i] }).then(function(ref) {
            console.log("added..." + ref);
          });
        }
      $scope.images = [];
      })
      // review.content = '';
      // $scope.review.rating = 0;
      // $scope.rating.rate = 0;
      $scope.editReviewModal.hide();
      // $scope.isAlreadyReviewed();
    };

    $ionicModal.fromTemplateUrl('app/review/_new-review.html', function(reviewModal) {
      $scope.reviewModal = reviewModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/review/_edit-review.html', function(editReviewModal) {
      $scope.editReviewModal = editReviewModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/review/_edit-review.html', function(editModalReview) {
      $scope.editReviewModal = editModalReview;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/reservation/_add-reservation.html', function(addReservationModal) {
      $scope.addReservationModal = addReservationModal;
    }, {
      scope: $scope
    })

    $scope.showConfirmDelete = function(review) {
      // var reviewObj = review;
      // var reviewRating = review.rating;
      // var reviewContent = review.content;
      var confirmDelete = $ionicPopup.confirm({
        title: "Delete Review",
        template: "Delete '" + review.content + "'?"
      })

      confirmDelete.then(function(res) {
        var reviewsDeleteRef = Database.reviewsReference().child(review.$id);
        if (res) {
          reviewsDeleteRef.remove();
          userReviewsRef.remove();
          $scope.isAlreadyReviewed();
          // $scope.review = {};
          // $scope.rating.rate = 0;
        } else {
          console.log("delete failed");
        }
      })
    }
  }
]);
