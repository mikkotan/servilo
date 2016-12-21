app.controller("DashboardMainCtrl", ["$scope", "$state", "$stateParams", "$ionicModal", "$ionicPopup", "$firebaseArray", "Restaurant", "Database", "$ionicLoading", "Upload", "$cordovaCamera", "CordovaGeolocation", "Advertisement", "User",
  function($scope, $state, $stateParams, $ionicModal, $ionicPopup, $firebaseArray, Restaurant, Database, $ionicLoading, Upload, $cordovaCamera, CordovaGeolocation, Advertisement, User) {
    $ionicLoading.show();

    $scope.data = {};
    $scope.countryCode = 'PH';


    $scope.advertise = function(restaurant) {
      $scope.advertiseModal.show()
    }

    $scope.createAdvertisement = function(advertisement) {
      advertisement.endDate.setHours(23);
      Advertisement.create({
        endDate : advertisement.endDate.getTime(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }, $stateParams.restaurantId)
        .then((ad) => {
          $scope.ad = ad
          alert('Advertisement Successfully created')
          $scope.advertiseModal.hide()
        })
        .catch((err) => {
          alert(err)
          $scope.advertiseModal.hide()
        })
    }

    Advertisement.isAdvertised($stateParams.restaurantId)
      .then((ad) => {
        $scope.ad = ad
      })

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

    $scope.setMarker = function(latitude, longitude) {
      $scope.marker = Restaurant.getMarker(latitude, longitude);
      $scope.map.center = {
        latitude: latitude,
        longitude: longitude
      };
    }

    $scope.$watch('data.location.formatted_address', function(newValue) {
      if (newValue == undefined) {
        console.log('Empty');
      } else {
        console.log('Has content');
        $scope.setMarker($scope.data.location.geometry.location.lat(), $scope.data.location.geometry.location.lng());
      }
    });

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
      var resObj = restaurant
      $ionicPopup.confirm({
        title: "Delete Restaurant",
        template: "Are you sure to delete '" + restaurant.name + "' ?"
      })
        .then((res) => {
          if (res) {
            $ionicLoading.show()
            Restaurant.delete(restaurant.$id)
              .then(() => {
                console.log('Success deleting ');
                Database.restaurantMenusReference().child(resObj.$id).remove();
                Database.userFavoritesReference().child(User.auth().$id).child(resObj.$id).remove()

                Database.restaurantReservationsReference().child(resObj.$id).once('value')
                  .then((snapshot) => {
                    for (var reservation in snapshot.val()) {
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
                $ionicLoading.hide()
                $state.go('tabs.restaurant');
              })
              .catch((err) => {
                $ionicLoading.hide()
                alert(err)
                console.log('Error on deleting: ' + err);
              })
          }
        })

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

      $scope.rating = {
        rate: 0,
        max: 5
      }

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
      $scope.marker = {
        id: 0
      };
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

      $scope.data.location = {
        formatted_address : restaurant.location
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

    $scope.useCurrent = function() {
      var currentLocation = CordovaGeolocation.get();

      $scope.setMarker(currentLocation.latitude, currentLocation.longitude);

      Restaurant.getLocation(currentLocation.latitude, currentLocation.longitude)
        .then(function(data) {
          $scope.data.location = data;
        });
    }

    $scope.edit = function(restaurant) {
      $ionicLoading.show();

      var location = $scope.data.location.formatted_address
      var lat = $scope.marker.coords.latitude
      var long = $scope.marker.coords.longitude
      Restaurant.editRestaurant(restaurant, location, lat, long, $scope.imageURL)
        .then(function() {
          $scope.imageURL = null;
          $scope.progress = null;
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

    $ionicModal.fromTemplateUrl('app/dashboard/_advertise.html', function(advertiseModal) {
      $scope.advertiseModal = advertiseModal;
    }, {
      scope: $scope
    })

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

    $scope.upload = function(index) {
      navigator.camera.getPicture(function(imageData) {
        Upload.restaurant(imageData).then(function(downloadURL) {
          $scope.imageLoading = false;
          $scope.imageURL = downloadURL;
        })
      }, function(message) {
        console.log('Failed because: ' + message);
        $scope.imageLoading = false;
        $scope.$apply();
      }, Upload.getOptions(index));
      $scope.imageLoading = true;
    }
    $scope.checkIfAllfalse = function(arr) {
        return Restaurant.checkIfAllfalse(arr);
    }
  }
]);
