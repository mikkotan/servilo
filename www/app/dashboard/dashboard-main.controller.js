app.controller("DashboardMainCtrl", ["$scope", "$state", "$stateParams", "$ionicModal", "$ionicPopup", "$firebaseArray", "Restaurant", "Database", "$ionicLoading",
  function($scope, $state, $stateParams, $ionicModal, $ionicPopup, $firebaseArray, Restaurant, Database, $ionicLoading) {
    $ionicLoading.show();

    Restaurant.get($stateParams.restaurantId).$loaded()
      .then((restaurant) => {
        $scope.restaurant = restaurant
        $scope.ready = true
        $ionicLoading.hide();
      })
    $scope.getFacilityName = Restaurant.getFacilityName;

    $scope.showMap = function() {
      var mapPopup = $ionicPopup.confirm({
        title: 'Choose Location',
        templateUrl: 'app/dashboard/_popout-google-maps.html',
        cssClass: 'custom-popup',
        scope: $scope
      });
      mapPopup.then(function(res) {
        if (res) {
          $scope.placeName($scope.marker.coords.latitude, $scope.marker.coords.longitude);
        }
      });
    };

    $scope.setHours = function() {
      var hoursPopup = $ionicPopup.confirm({
        title: 'Set Opening and Closing Hours',
        templateUrl: 'app/dashboard/_popout-hours.html',
        cssClass: 'custom-popup',
        scope: $scope
      });
    };

    $scope.setFacilities = function() {
      var facilities = $ionicPopup.alert({
        title: 'Set Facilities Offered',
        templateUrl: 'app/dashboard/_popout-facilities.html',
        subTitle: 'Amenities available for the customers in your restaurant.',
        cssClass: 'custom-popup',
        scope: $scope
      });
    };

    $scope.setOpenDays = function() {
      var openDays = $ionicPopup.alert({
        title: 'Set Open Days',
        templateUrl: 'app/dashboard/_popout-opendays.html',
        subTitle: 'Set the days open on your restaurant.',
        cssClass: 'custom-popup',
        scope: $scope
      })
    }

    $scope.showDelete = function(restaurant) {
      var deletePopup = $ionicPopup.confirm({
        title: 'Sure to delete?',
        cssClass: 'custom-popup',
        scope: $scope
      })
        .then(function(res) {
          if (res) {
            $scope.deleteRestaurant(restaurant);
          }
        })
    };

    $scope.deleteRestaurant = function(restaurant) {
      var resObj = restaurant;
      Restaurant.delete(restaurant.$id)
        .then(() => {
          console.log('Success deleting ');
        })
        .catch((err) => {
          console.log('Error on deleting: '+err);
        })
      // for (var menu in resObj.menus) {
      //   var menusRef = firebase.database().ref().child('menus');
      //   menusRef.child(menu).set(null);
      // }
      //
      // for (var review in resObj.reviews) {
      //   var reviewsRef = firebase.database().ref().child('reviews');
      //   reviewsRef.child(review).set(null);
      // }
      //
      // for (var reviewer in resObj.reviewers) {
      //   var userReviewedRestaurantsRef = firebase.database().ref().child('users').child(reviewer).child('reviewed_restaurants');
      //   console.log('reviewer ref' + userReviewedRestaurantsRef);
      //   userReviewedRestaurantsRef.child(resObj.$id).set(null);
      // }
      Database.restaurantMenusReference().child(resObj.$id).remove();

      Database.restaurantReservationsReference().child(resObj.$id).once('value')
        .then((snapshot) => {
          for (var reservation in snapshot.val()) {
            console.log(reservation);
            Reservation.delete(reservation)
              .then(() => {
                console.log('delete sucess')
                alert('delete success');
              })
              .catch((err) => {
                console.log(err)
                alert(err);
              })
          }
        })

      Database.restaurantOrdersReference().child(resObj.$id).once('value')
        .then((snapshot) => {
          for (var order in snapshot.val()) {
            console.log(order);
            Order.delete(order)
              .then(() => {
                console.log('success')
              })
              .catch((err) => {
                console.log(err)
                alert(err);
              })
          }
        })
      $state.go('tabs.restaurant');
    }

    $scope.placeName = function(latitude, longitude) {
      console.log(latitude);
      console.log(longitude);
      Restaurant.getLocationName(latitude, longitude).then(function(data) {
        $scope.eRestaurant.location = data
        console.log(data);
      });
    }
  
    $scope.editRestaurant = function(restaurant) {
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
            // $scope.$apply(function () {
            google.maps.event.trigger(map, "resize");
            // });
          },
          click: function(map, eventName, originalEventArgs) {
            var coords = originalEventArgs[0];
            var m = {
              id: Date.now(),
              coords: {
                latitude: coords.latLng.lat(),
                longitude: coords.latLng.lng()
              }
            };
            $scope.marker = m;
            $scope.$apply();
          }
        }
      }
      $scope.marker = {id: 0};
      $scope.timeD = restaurant.openTime;
      $scope.eRestaurant = {
        resto: restaurant.name,
        $id: restaurant.$id,
        name: restaurant.name,
        phonenumber: parseInt(restaurant.phonenumber),
        type: restaurant.type,
        cuisine: restaurant.cuisine,
        openTime: new Date(restaurant.openTime),
        closeTime: new Date(restaurant.closeTime),
        openDays: restaurant.openDays,
        facilities: restaurant.facilities,
        location: restaurant.location,
        photoURL: restaurant.photoURL
      };
      $scope.restaurantEditModal.show();
      if (restaurant.photoURL) {
        $scope.imageURL = restaurant.photoURL;
      } else {
        $scope.imageURL = null;
      }
      $scope.restaurantName = restaurant.name;
      $scope.marker.coords = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
      };
    }

    $scope.edit = function(restaurant) {
      $ionicLoading.show();
      Restaurant.editRestaurant(restaurant, $scope.marker, $scope.imageURL)
        .then(function() {
          $scope.imageURL = null;
          $ionicLoading.hide();
          $scope.restaurantEditModal.hide();
        })
    }

    $scope.closeEditRestaurant = function() {
        $scope.restaurantEditModal.hide();
        $scope.imageURL = null;
    }

    $ionicModal.fromTemplateUrl('app/restaurant/_edit-restaurant.html', function(restaurantEditModal) {
      $scope.restaurantEditModal = restaurantEditModal;
    }, {
      scope: $scope
    });

    $scope.facilities = $firebaseArray(firebase.database().ref().child('facilities'));
    // $scope.facilities = $firebaseArray(Database.facilitiesReference());

    $scope.days = {
      '0': {
        name: 'Monday'
      },
      '1': {
        name: 'Tuesday'
      },
      '2': {
        name: 'Wednesday'
      },
      '3': {
        name: 'Thursday'
      },
      '4': {
        name: 'Friday'
      },
      '5': {
        name: 'Saturday'
      },
      '6': {
        name: 'Sunday'
      }
    }

  }
]);
