app.controller("RestaurantCtrl", ["$scope", "$firebaseArray", "User", "$ionicModal", "$ionicListDelegate", "Restaurant", "$cordovaCamera", "CordovaGeolocation", "Upload", "$ionicPopup", "Order", "Database", "Reservation",
  function($scope, $firebaseArray, User, $ionicModal, $ionicListDelegate, Restaurant, $cordovaCamera, CordovaGeolocation, Upload, $ionicPopup, Order, Database, Reservation) {

    $scope.modalControl = {};
    $scope.facilities = Database.facilities();
    $scope.categories = Database.categories();
    $scope.displayRestaurants = User.getAuthRestaurants();
    $scope.AppUser = User.auth();

    $scope.data = {};
    $scope.countryCode = 'PH';

    console.log($scope.AppUser);

    $scope.rating = {
      rate: 0,
      max: 5
    }

    $scope.showMap = function() {
      var lat = $scope.marker.coords.latitude;
      var long = $scope.marker.coords.longitude;
      $scope.setMarker(lat, long);
      var mapPopup = $ionicPopup.confirm({
        title: 'Set Markers',
        templateUrl: 'app/restaurant/_googleMapsPopout.html',
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
        templateUrl: 'app/restaurant/_hoursPopout.html',
        cssClass: 'custom-popup',
        scope: $scope
      });
    };

    $scope.setFacilities = function() {
      var facilities = $ionicPopup.alert({
        title: 'Set Facilities Offered',
        templateUrl: 'app/restaurant/_facilitiesPopout.html',
        subTitle: 'Amenities available for the customers in your restaurant.',
        cssClass: 'custom-popup',
        scope: $scope
      });
    };

    $scope.setCategories = function() {
      var categories = $ionicPopup.alert({
        title: 'Set Category of your restaurant. You may select 1 or more',
        templateUrl: 'app/restaurant/_categoriesPopout.html',
        subTitle: 'Choose the specific category of your restaurant to be categorized later.',
        cssClass: 'custom-popup',
        scope: $scope
      })
    }

    $scope.setOpenDays = function() {
      var openDays = $ionicPopup.alert({
        title: 'Set Open Days',
        templateUrl: 'app/restaurant/_openDaysPopout.html',
        subTitle: 'Set the days open on your restaurant.',
        cssClass: 'custom-popup',
        scope: $scope
      })
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User:" + user.uid);
      } else {
        console.log("NOT LOGGED IN");
      }
    });

    $scope.changeServiceStatus = function(restaurant, service) {
      Restaurant.changeServiceStatus(restaurant, service);
    };

    $scope.changeAvailability = function(restaurant) {
      Restaurant.changeAvailability(restaurant);
    };

    $scope.imageURL = "";
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

      // $cordovaCamera.getPicture(Upload.getOptions(index)).then(function(imageData) {
      //   Upload.restaurant(imageData).then(function(downloadURL) {
      //     $scope.imageLoading = false;
      //     $scope.imageURL = downloadURL;
      //   })
      // }, function(error) {
      //   console.log('Failed because: ' + error);
      // });
    }

    var clearFields = function(restaurant) {
      restaurant.name = "";
      restaurant.location = "";
      restaurant.type = "";
      restaurant.cuisine = "";
      restaurant.phonenumber = "";
      restaurant.closeTime = "";
      $scope.imageURL = null;
      $scope.progress = null;
      $scope.data.location = "";
      $scope.marker.coords = "";
    }

    $scope.addRestaurant = function(restaurant) {
      console.log(restaurant.categories);
      try {
        var location = $scope.data.location.formatted_address
        var lat = $scope.marker.coords.latitude
        var long = $scope.marker.coords.longitude
        Restaurant.addPendingRestaurant(restaurant, location, lat, long, $scope.imageURL);
        clearFields(restaurant);
        $scope.restaurantModal.hide();
      } catch (e) {
        $scope.submitError = true;
      }
    }

    $scope.edit = function(restaurant) {
      console.log(JSON.stringify(restaurant, null, 4));

      Restaurant.editRestaurant(restaurant, $scope.marker, $scope.imageURL)
        .then(function() {
          $scope.imageURL = null;
        })
      $scope.restaurantEditModal.hide();
      $ionicListDelegate.closeOptionButtons();
    }

    $ionicModal.fromTemplateUrl('app/restaurant/_new-restaurant.html', function(restaurantModal) {
      $scope.restaurantModal = restaurantModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/restaurant/_edit-restaurant.html', function(restaurantEditModal) {
      $scope.restaurantEditModal = restaurantEditModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/menu/_add-category-modal.html', function(addCategoryModal) {
      $scope.addCategoryModal = addCategoryModal;
    }, {
      scope: $scope
    })

    $scope.$watch('data.location.formatted_address', function(newValue) {
      if (newValue == undefined) {
        console.log('Empty');
      } else {
        console.log('Has content');
        $scope.setMarker($scope.data.location.geometry.location.lat(), $scope.data.location.geometry.location.lng());
      }
    });

    $scope.showAddCategoryModal = function(resId) {
      console.log('show add category');
      console.log('restaurant id : ' + resId);
      $scope.category = {
        restaurant_id: resId
      }
      $scope.addCategoryModal.show();
    }

    $scope.addCategory = function(category) {
      Restaurant.addCategory(category)
        .then(function() {
          console.log('ADDED CATEGORY!! ')
        })
      $scope.category.name = "";
      $scope.category.restaurant_id = "";
      $scope.addCategoryModal.hide();
    }

    $scope.deleteRestaurant = function(restaurant) {
      var resObj = restaurant;
      // $scope.displayRestaurants.$remove(resObj).then(function() {
      //   console.log('deleted?');
      // });
      Restaurant.delete(restaurant.$id)
        .then(() => {
          console.log('Success deleting ');
        })
        .catch((err) => {
          console.log('Error on deleting: ' + err);
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
    }

    // $scope.editRestaurant = function(restaurant) {
    // console.log(restaurant);
    //   console.log(JSON.stringify(restaurant, null, 4));
    //   $scope.restaurantEditModal.show();
    //   $scope.eRestaurant = restaurant;
    //   $scope.eRestaurant.phonenumber = parseInt(restaurant.phonenumber)
    //   if (restaurant.photoURL) {
    //     $scope.imageURL = restaurant.photoURL;
    //   } else {
    //     $scope.imageURL = null;
    //   }
    //   $scope.restaurantName = restaurant.name;
    //   $scope.marker.coords = {
    //     latitude: restaurant.latitude,
    //     longitude: restaurant.longitude
    //   };
    // }

    $scope.approveRestaurant = function(restaurant) {
      $scope.pendingRestaurants.$remove(restaurant)
        .then(() => {
          var add = Restaurant.addRestaurant(restaurant);
          add.ref
            .then(() => {
              Restaurant.getTimestamp(add.key).transaction(function(currentTimestamp) {
                return firebase.database.ServerValue.TIMESTAMP;
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    $scope.newRestaurant = function() {
      $scope.restaurant = {
        openTime: new Date()
      }
      $scope.restaurantModal.show();
      $scope.imageURL = null;
    }

    $scope.closeEditRestaurant = function() {
      $scope.restaurantEditModal.hide();
      $scope.imageURL = null;
    }


    $scope.marker = {
      id: 0
    };
    $scope.map = {
      control: {},
      center: {
        latitude: 10.73016704689235,
        longitude: 122.54616022109985
      },
      zoom: 20,
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
    };

    $scope.markLocation = function() {
      var currentLocation = CordovaGeolocation.get();
      $scope.setMarker(currentLocation.latitude, currentLocation.longitude);
    }


    $scope.useCurrent = function() {
      var currentLocation = CordovaGeolocation.get();
      $scope.setMarker(currentLocation.latitude, currentLocation.longitude);
      Restaurant.getLocation(currentLocation.latitude, currentLocation.longitude).then(function(data) {
        $scope.data.location = data;
        //   $scope.data.location.geometry.location.lat = currentLocation.latitude;
        //   $scope.data.location.geometry.location.lng = currentLocation.longitude;
        // $scope.restaurant.location = data
        // console.log($scope.restaurant.location)
      });
    }

    $scope.placeName = function(latitude, longitude) {
      Restaurant.getLocationName(latitude, longitude).then(function(data) {
        $scope.restaurant.location = data
      });
    }

    //change the marker location
    $scope.setMarker = function(latitude, longitude) {
      $scope.marker = Restaurant.getMarker(latitude, longitude);
      $scope.map.center = {
        latitude: latitude,
        longitude: longitude
      };
    }



    $scope.$watch(function($scope) {
        return $scope.data.detail;
      },
      function(newValue, oldValue) {
        if (oldValue !== newValue) {
          if (angular.isDefined(newValue)) {
            var lat = newValue.lat();
            var lng = newValue.lng();
            $scope.setMarker(lat, lng);
          }
        }
      });



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
])
