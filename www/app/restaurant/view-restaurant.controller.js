app.controller("ViewRestaurantCtrl", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "Database", "$ionicLoading", "$ionicModal", "$ionicPopup", "$cordovaGeolocation", "$stateParams", "Restaurant", "User", "Review", "Reservation", "$ionicLoading",
  function($scope, $state, $firebaseArray, $firebaseObject, Database, $ionicLoading, $ionicModal, $ionicPopup, $cordovaGeolocation, $stateParams, Restaurant, User, Review, Reservation, $ionicLoading) {

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


    if ($state.is("tabs.viewRestaurant.main")) {
      var id = $stateParams.restaurantId;
      var userReviewsRef = Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id); //new subs below
      var restaurantReviewsRef = Database.reviewsReference().orderByChild('restaurant_id').equalTo(id); //new subs above

      $scope.isAlreadyReviewed = function() {
        userReviewsRef.once('value', function(snapshot) {
          $scope.exists = (snapshot.val() != null);
          $scope.review = $firebaseObject(Database.reviewsReference().child(snapshot.val()));
        })
      }

      $scope.restaurant = Restaurant.get(id);
      $scope.isAlreadyReviewed();
      $scope.restaurantReviews = $firebaseArray(restaurantReviewsRef);
    };

    if ($state.is("tabs.viewRestaurant.menus")) {
      $scope.restaurantMenus = Restaurant.getMenus($stateParams.restaurantId);


    };

    $scope.restaurantStatus.on('value', function(snap) {
      $scope.getRestaurantStatus = snap.val() ? "Online" : "Offline";
    })

    $scope.isAlreadyReviewed = function() {
      userReviewsRef.once('value', function(snapshot) {
        $scope.exists = (snapshot.val() !== null);
        $scope.review = $firebaseObject(Database.reviewsReference().child(snapshot.val()));
      })
    }

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

    $scope.goToMenus = function(restaurant, service) {
      transaction = {}
      switch (service.name) {
        case "online":
          $state.go("tabs.viewRestaurant.menus", {
            restaurantId: id
          })
          transaction.serviceType = "online"
          transaction.restaurant_id = restaurant.$id
          transaction.customer_id = "myId"
          break;
        case "reserve":
          console.log("reserve clicked");
          $scope.reservation = {
            datetime: new Date(),
            number_of_persons: 2,
          }
          $scope.addReservationModal.show();
          break;
        default:

      }

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
    // $scope.editImages = [];

    $scope.selImages = function() {
      var options = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
      };
      window.imagePicker.getPictures(
        function(results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            window.plugins.Base64.encodeFile(results[i], function(base64) {
              $scope.images.push(base64);
              $scope.$apply();
            });
          }
        },
        function(error) {
          console.log('Error: ' + error);
        }, {
          maximumImagesCount: 10,
          width: 800,
          quality: 80,
          // output type, defaults to FILE_URIs.
          // available options are
          // window.imagePicker.OutputType.FILE_URI (0) or
          // window.imagePicker.OutputType.BASE64_STRING (1)
          // outputType: window.imagePicker.OutputType.BASE64_STRING
        }
      );

      // $cordovaImagePicker.getPictures(options)
      // .then(function (results) {
      //   for (var i = 0; i < results.length; i++) {
      //     window.plugins.Base64.encodeFile(results[i], function(base64){
      //       $scope.images.push(base64);
      //       $scope.$apply();
      //     });
      //     console.log('Image URI: ' + results[i]);
      //   }
      // }, function(error) {
      //   // error getting photos
      // });
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
      })
    }

    $scope.updateReview = function(review) {
      // console.log("hiiii");
      var reviewRef = Database.reviewsReference().child(review.$id);
      var reviewRating = review.rating;
      reviewRef.update({
        content: review.content,
        rating: review.rating
      }).then(function() {
        console.log("finished updating review.");
        // var newImages = newReviewRef.child(review.$id).child('images');
        // var list = $firebaseArray(newImages);
        // for (var i = 0; i < $scope.images.length; i++) {
        //   list.$add({ image: $scope.images[i] }).then(function(ref) {
        //     console.log("added..." + ref);
        //   });
        // }
      })
      review.content = '';
      $scope.review.rating = 0;
      $scope.rating.rate = 0;
      $scope.editReviewModal.hide();
      $scope.isAlreadyReviewed();
      $scope.images = [];
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
      var reviewObj = review;
      var reviewRating = review.rating;
      var reviewContent = review.content;
      var confirmDelete = $ionicPopup.confirm({
        title: "Delete Review",
        template: "Delete '" + reviewContent + "'?"
      })

      confirmDelete.then(function(res) {
        var reviewsDeleteRef = firebase.database().ref().child('reviews').child(review.$id);
        if (res) {
          reviewsDeleteRef.remove();
          userReviewsRef.remove();
          $scope.isAlreadyReviewed();
          $scope.review = {};
          $scope.rating.rate = 0;

        } else {
          console.log("delete failed");
        }
      })
    }

    $scope.mapDirection = [];
    $scope.currentLocation = {};
    $scope.restaurantMarkers = [];
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      $scope.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    });

    $scope.setMap = function(restaurant) {
      $scope.map = {
        center: {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        },
        zoom: 14,
        options: {
          scrollwheel: false
        },
        bounds: {},
        events: {
          tilesloaded: function(map) {
            $scope.$apply(function() {
              google.maps.event.trigger(map, "resize");
            });
          }
        }
      };
      $scope.restaurantMarkers.push({
        id: Date.now(),
        coords: {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        }
      });
    };

    $scope.markerEvents = {
      click: function(marker, eventName, model) {
        $state.go("tabs.viewRestaurant", {
          restaurantId: model.id
        });
      }
    };

    $scope.showPath = function(restaurant) {
      $scope.map.zoom = 12;
      var mapDirection = new google.maps.DirectionsService();
      var request = {
        origin: {
          lat: $scope.currentLocation.latitude,
          lng: $scope.currentLocation.longitude
        },
        destination: {
          lat: restaurant.latitude,
          lng: restaurant.longitude
        },
        travelMode: google.maps.DirectionsTravelMode['DRIVING'],
        optimizeWaypoints: true
      };

      $scope.restaurantMarkers.push({
        id: Date.now(),
        coords: {
          latitude: $scope.currentLocation.latitude,
          longitude: $scope.currentLocation.longitude
        }
      });

      mapDirection.route(request, function(response, status) {
        var steps = response.routes[0].legs[0].steps;
        var distance = response.routes[0].legs[0].distance.value / 1000;
        distance = distance.toFixed(2);
        for (i = 0; i < steps.length; i++) {
          var strokeColor = '#049ce5';
          if ((i % 2) == 0) {
            strokeColor = '#FF9E00';
          }
          $scope.mapDirection.push({
            id: i,
            paths: steps[i].path,
            stroke: {
              color: strokeColor,
              weight: 5
            }
          });
        }
        $scope.restaurantMarkers[0].icon = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=restaurant|edge_bc|FFBB00|000000|' +
          restaurant.name + '|Distance: ' + distance + 'km');
        $scope.$apply();
      });
    };
  }
]);
