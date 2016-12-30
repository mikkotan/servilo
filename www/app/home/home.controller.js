app.controller('HomeTabCtrl', ["$scope", "$ionicSlideBoxDelegate", "$ionicModal", "$state", "ionicMaterialInk", "ionicMaterialMotion",
"$ionicLoading", "Home", "$timeout", "User", "CordovaGeolocation", "Advertisement", "Restaurant", "Category","currentAuth",
  function($scope, $ionicSlideBoxDelegate, $ionicModal, $state, ionicMaterialInk, ionicMaterialMotion, $ionicLoading, Home, $timeout,
    User,CordovaGeolocation, Advertisement, Restaurant, Category , currentAuth) {

    // ionicMaterialInk.displayEffect();
    var vm = this;
    console.log("Home controller");
    User.setOnline(currentAuth.uid);
    $scope.currentLocation = CordovaGeolocation.get();

    setTimeout(function() {
      $ionicSlideBoxDelegate.update();
    }, 5000);

    $scope.goToRestaurant = function(id) {
      return $state.go('tabs.search')
        .then(() => {
          $state.go('tabs.viewRestaurant.main', {
            restaurantId: id
          })
        })
    }
    //comment for now
    // cordova.plugins.diagnostic.isLocationAvailable(function(available) {
    //   console.log("Location is " + (available ? "available" : "not available"));
    //   if(!available) {
    //     cordova.plugins.locationAccuracy.request(function(success) {
    //       console.log("Successfully requested accuracy: "+success.message);
    //     }, function(error) {
    //       console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
    //        if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
    //            if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
    //                cordova.plugins.diagnostic.switchToLocationSettings();
    //            }
    //        }
    //     }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    //   }
    // }, function(error) {
    //   console.error("The following error occurred: "+error);
    // });

    // --------------- NEW CATEGORY LOOP ---------
    Category.getAllCategories().$loaded()
      .then((categories) => {

        $scope.categories = categories

      })
    // --------------- END NEW CATEGORY LOOP ------

    // --------------- NEW SELECTED CATEGORY RESTAURANTS LOOP ------
    $scope.selectCategory = function(id) {
      return Category.getRestaurants(id).$loaded()
        .then((restaurants) => {

          $scope.selectedCategoryRestaurants = restaurants.map(function(restaurant) {

            var r = {
              get: Restaurant.get(restaurant.$id).$loaded()
                .then((restaurant) => {
                  r.details = restaurant
                  Restaurant.getAverageRating(restaurant.$id)
                    .then((avg) => {
                      r.avg = avg
                      $scope.$apply()
                    })
                })
            }

            return r
          })
        })
    }
    // --------------- END NEW SELECTED CATEGORY RESTAURANTS LOOP -----


    Advertisement.getRestaurants().$loaded()
      .then((restaurants) => {
        $scope.advertisedRestaurants = restaurants

        $scope.$watchCollection('advertisedRestaurants', function(watchedAdvertisements) {
          $scope.newAdvertisements = watchedAdvertisements.map(function(advertisement) {
            var a = {
              get: Restaurant.get(advertisement.$id).$loaded()
                .then((restaurant) => {
                  a.details = restaurant
                  Restaurant.getAverageRating(restaurant.$id)
                    .then((avg) => {
                      a.avg = avg
                      a.ready = true
                      $scope.$apply()
                      $ionicSlideBoxDelegate.update();
                    })
                })
            }
            return a
          })
        })

      })
      .catch((err) => {
        alert(err)
      })

    $scope.$on('ngLastRepeat.workorderlist', function(e) {
      $scope.materialize();
    });

    $scope.materialize = function() {
      $timeout(function() {
        // ionicMaterialMotion.fadeSlideInRight();
        ionicMaterialInk.displayEffect();
      }, 0);
    };




    $scope.options = {
      loop: false,
      effect: 'slide',
      autoplay: 3000,
      speed: 500,
      paginationHide: true
    }
    $scope.data = {};
    $scope.$watch('data.slider', function(nv, ov) {
      $scope.slider = $scope.data.slider;
    })

    console.log('HomeTabCtrl');
    vm.restaurants = Home.srestaurants();
    vm.noMoreItemsAvailable = false;

    $scope.loadMore = function() {
      Home.srestaurants().$loaded().then(function(x) {
        lastKey = Home.getLastKey(vm.restaurants);
        Home.nextRestaurants(lastKey).$loaded().then(function(data) {
          if (data.length <= 0) {
            vm.noMoreItemsAvailable = true;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          vm.restaurants = vm.restaurants.concat(data);
        })
      })
    };

    $scope.doRefresh = function() {
      Home.srestaurants().$loaded().then(function(data) {
        vm.restaurants = data;
        $scope.$broadcast('scroll.refreshComplete');
        vm.noMoreItemsAvailable = false;
      });
    };

    // $scope.searchChange = function(name) {
    //   if (name !== '') {
    //     // first solution
    //     // var results = [];
    //     // Home.search(name).on("child_added", function(snapshot) {
    //     //   results.push(snapshot.val());
    //     //   vm.restaurants = results;
    //     //   $scope.$apply();
    //     // })

    //     // second solution
    //     Home.search(name).$loaded().then(function(data) {
    //       if (data.length <= 0) {
    //         console.log('no results found! :(');
    //       }
    //       vm.restaurants = $scope.solveDistances(data);
    //       console.log(vm.restaurants);
    //     });
    //   } else {
    //     vm.restaurants = Home.srestaurants();
    //   }
    // }

    $scope.solveDistances = function(data) {
      angular.forEach(data, function(restaurant) {
        $scope.getDistance(restaurant);
      });
      return data;
    }

    $scope.CallNumber = function(number) {
      window.plugins.CallNumber.callNumber(function() {
        console.log("call success");
      }, function() {
        console.log("call failed");
      }, number)
    };

    //getting the distance
    $scope.getDistance = function(restaurant) {
      $scope.currentLocation = CordovaGeolocation.get();
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

      mapDirection.route(request, function(response, status) {
        var distance = response.routes[0].legs[0].distance.value / 1000;
        distance = distance.toFixed(2);
        restaurant.distance = distance;
        $scope.$apply();
      });
    };

  }
]);
