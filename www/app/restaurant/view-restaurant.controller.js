app.controller("ViewRestaurantCtrl", ["$scope", "$state", "$firebaseArray", "Upload", "Database", "$ionicLoading", "$ionicModal", "$ionicPopup", "CordovaGeolocation", "$stateParams", "Restaurant", "User", "Review", "Reservation", "$ionicLoading",
  function($scope, $state, $firebaseArray, Upload, Database, $ionicLoading, $ionicModal, $ionicPopup, CordovaGeolocation, $stateParams, Restaurant, User, Review, Reservation, $ionicLoading) {

    console.log("View Restaurant Ctrl")

    $scope.rating = {
      rate: 0,
      max: 5
    }
    $scope.bookReservation = function(reservation) {
      //   $ionicLoading.show();
      var reservationObject = {
        datetime: reservation.datetime.getTime(),
        number_of_persons: reservation.number_of_persons,
        status: 'pending',
        user_id: User.auth().$id,
        restaurant_id: id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }

      var confirmReservation = $ionicPopup.confirm({
        title: 'Confirm',
        template: 'Confirm your reservation?',
        cssClass: 'custom-popup',
        scope: $scope
      });
      confirmReservation.then(function(res) {
        if (res) {
          Reservation.create(reservationObject);
          $scope.addReservationModal.hide();
        }
      });
    }

    var id = $stateParams.restaurantId;
    var userReviewsRef = Review.userReview(id);
    Restaurant.get(id).$loaded()
      .then(function(restaurant) {
        $scope.restaurant = restaurant;
        $scope.getReviewer = Review.reviewer;
        var restaurantStatus = Restaurant.getRestaurantStatus(restaurant.owner_id)
        restaurantStatus.on('value', function(snap) {
          $scope.getRestaurantStatus = snap.val() ? true : false;
        })

        User.hasFavored(restaurant.$id)
          .then((val) => {
            console.log('Hasfavored from controller : '+val)
            $scope.hasFavored = val
          })
          .catch((err) => {
            console.log('Has favored error');
            console.log(err);
          })

        $scope.hasFavored = User.hasFavored(restaurant.$id);

        $scope.restaurantOpenStatus = Restaurant.getRestaurantOpenStatus(restaurant);
        $scope.restaurantReviews = Restaurant.getReviews(restaurant.$id);
      })

    $scope.isAlreadyReviewed = function() {
      userReviewsRef.once('value', function(snapshot) {
        $scope.exists = snapshot.val();
        if ($scope.exists !== null) {
          $scope.review = Review.get(snapshot.val());
        }
      })
    }
    $scope.isAlreadyReviewed();



    $scope.addToFavorites = function() {
      User.addToFavorites($scope.restaurant);
    }



    $scope.showAddReservationModal = function() {
      $scope.reservation = {
        datetime: new Date(),
        number_of_persons: 2,
      }
      $scope.addReservationModal.show();
    }

    $scope.images = [];

    $scope.selImages = function() {
      window.imagePicker.getPictures(
        function(results) {
          for (var i = 0; i < results.length; i++) {
            window.plugins.Base64.encodeFile(results[i], function(base64) {
              var reviewsRef = Upload.get(base64);
              reviewsRef.on('state_changed', function(snapshot) {
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
          console.log('Error: ' + JSON.stringify(error));
        }, {
          maximumImagesCount: 10,
          width: 400,
          quality: 20
        }
      );
    };

    $scope.addReview = function(review) {
      $ionicLoading.show();
      // var reviewRating = review.rating;
      Database.reviews().$add({
        content: review.content,
        rating: review.rating,
        prevRating: review.rating,
        reviewer_id: User.auth().$id,
        restaurant_id: id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(function(review) {
        $ionicLoading.hide();
        var list = Upload.multipleUpload(review.key);
        for (var i = 0; i < $scope.images.length; i++) {
          list.$add({
              image: $scope.images[i]
            })
            .then(function(ref) {
              console.log("added..." + ref);
            });
        }
        console.log("add review done");
        Review.userReview(id).set(review.key);
        // Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id).set(review.key);
        // Database.restaurantsReference().child(id).child('reviews').child(review.key).set(true); //new
        // Database.restaurantsReference().child(id).child('reviewers').child(User.auth().$id).set(true); //new
        $scope.isAlreadyReviewed();
        $scope.reviewModal.hide();
        review.content = '';
        $scope.review.rating = 0;
        $scope.rating.rate = 0;
        $scope.images = [];
        $ionicLoading.hide();

        var restaurant_owner = Restaurant.getOwner($scope.restaurant.$id);
        Database.notificationsReference().child(restaurant_owner.$id).push().set({
          sender_id: User.auth().$id,
          restaurant_id: id,
          type: 'review',
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function(x) {
          console.log("hello notification squad");
          $ionicLoading.hide();
        })
      })
    }

    $scope.openEditModal = function(review) {
      console.log("open edit modal");
      $scope.editReviewModal.show();
      $scope.editImages = Upload.multipleUpload(review.$id);
    }

    $scope.updateReview = function(review) {
      var reviewRef = Review.getReview(review.$id);
      // var reviewRating = review.rating;
      reviewRef.update({
        content: review.content,
        rating: review.rating
      }).then(function() {
        console.log($scope.images)
        console.log("finished updating review.");
        var list = Upload.multipleUpload(review.$id);
        for (var i = 0; i < $scope.images.length; i++) {
          list.$add({
            image: $scope.images[i]
          }).then(function(ref) {
            console.log("added..." + ref);
          });
        }
        $scope.images = [];
      })
      $scope.editReviewModal.hide();
      $scope.isAlreadyReviewed();
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
      var confirmDelete = $ionicPopup.confirm({
        title: "Delete Review",
        template: "Delete '" + review.content + "'?"
      })

      confirmDelete.then(function(res) {
        var reviewsDeleteRef = Review.getReview(review.$id);
        if (res) {
          reviewsDeleteRef.remove();
          userReviewsRef.remove();
          $scope.isAlreadyReviewed();
        } else {
          console.log("delete failed");
        }
      })
    }
  }
]);
