app.controller('SearchTabCtrl', ["$scope", "Auth", "$state", "User", "ionicMaterialInk", "$timeout", "$ionicPopup", "CordovaGeolocation", "ionicToast", "$ionicLoading", "Search", "currentGeoLocation", "Restaurant", "$ionicActionSheet",
  function($scope, Auth, $state, User, ionicMaterialInk, $timeout, $ionicPopup, CordovaGeolocation, ionicToast, $ionicLoading, Search, currentGeoLocation, Restaurant, $ionicActionSheet) {

    // $scope.isLocationAvailable = false; //mobile
    $scope.isLocationAvailable = true; //browser
    var checkLocation = function() {
      if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) { //uncomment if working in browser 
      cordova.plugins.diagnostic.isLocationAvailable(function(available) {
        console.log("Location is " + (available ? "available" : "not available"));
        if(available) {
          $scope.isLocationAvailable = true;
        } else {
          $scope.isLocationAvailable = false;
        }
      }, function(error) {
        console.error("The following error occurred: "+error);
      });
    } //uncomment if working in browser 
    }
    checkLocation();

    $scope.doRefresh = function() {
      checkLocation();
      $scope.$broadcast('scroll.refreshComplete');
    }

    ionicMaterialInk.displayEffect();
    $scope.$on('ngLastRepeat.workorderlist', function(e) {
      $scope.materialize();
    });
    
    $scope.showList = true;
    $scope.showMap = false;

    $scope.mapView = function() {
      $scope.showList = false;
      $scope.showMap = true;
    }
    $scope.listView = function() {
      $scope.showList = true;
      $scope.showMap = false;
    }

    $scope.materialize = function() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
      }, 0);
    };

    $scope.filterName = 'name';
    $scope.changeFilter = function(filterName) {
      var previousFilterName = filterName;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Search by',
        templateUrl: 'app/search/_search.filter.html',
        scope: $scope
      });

      confirmPopup.then(function(res) {
        if (res) {
          $scope.filterName = $scope.data.filter;
          $scope.clearField();
          $scope.clearLocationField();
        }
        else {
          $scope.data.filter = previousFilterName;
        }
      });
    }

    $scope.showActionsheet = function(restaurant) {
      $ionicActionSheet.show({
        titleText: '<p class="capitalize">' + restaurant.name + '</p>',
        buttons: [{
          text: '<i class="icon ion-arrow-right-b"></i> View'
        }, {
          text: '<i class="icon ion-ios-telephone"></i> Call'
        }],
        // destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          switch (index) {
            case 0:
              $state.go("tabs.viewRestaurant.main", {
                "restaurantId": restaurant.$id
              });
              break;
            case 1:
              $scope.CallNumber(restaurant.phonenumber);
              break;
          }
          console.log('BUTTON CLICKED', index);
          return true;
        },
        // destructiveButtonClicked: function() {
        //   console.log('DESTRUCT');
        //   return true;
        // }
      });
    }
    console.log('SearchTabCtrl');
    $scope.restaurants = [];
    $scope.markers = [];
    $scope.map = Search.getMap();
    var isMarkerCanChange = true;
    $scope.mapText = "Nearest restaurant to your location (1km)";

    $scope.data = {};
    $scope.countryCode = 'PH';
    $scope.rating = {
      rate: 0,
      max: 5
    }
    $scope.goToMyOrders = function() {
      $state.go("tabs.myOrders")
    }

    $scope.$watch('restaurants', function() {
      console.log('restaurants changed');
    })

    $scope.$watchCollection('restaurants', function(newRestaurants) {
      $scope.loading = false;
      console.log('WATCH COLLECTION BEING RUN');
      $scope.newRestaurants = newRestaurants.map(function(restaurant) {
        console.log(restaurant);
        var r = {
          details: restaurant,
          getAvg: Restaurant.getAverageRating(restaurant.$id)
            .then((res) => {
              r.avg = res
              r.ready = true
              $scope.$apply();
            })
        }
        return r;
      })
    })

    $scope.addMarkers = function(item) {
      $scope.markers.push(Search.getMarker(item));
    };

    $scope.markerEvents = {
      click: function(marker, eventName, model) {
        if (model.id != '0') {

        //   infowindow.open(marker);

          $state.go("tabs.viewRestaurant.main", {
            restaurantId: model.id
          });
        }
      }
    };

    $scope.showNear = function() {
      cordova.plugins.diagnostic.isLocationAvailable(function(available) { //comment to work on browser
        if(available) {                                                    //comment to work on browser
          $scope.allowMarkerChange('', 'name');
          var currentLocation = CordovaGeolocation.get();
          $scope.markers.push(Search.getYouAreHere());
          $scope.loading = true;
          Search.getRestaurant().on("child_added", function(snapshot) {
            if (Search.getNear(snapshot.key, snapshot.val())) {
              $scope.loading = false;
              var getNear = Search.getNear(snapshot.key, snapshot.val());
              $scope.markers.push(getNear.marker);
              $scope.restaurants.push(getNear.restaurant);
            }
          })
          $scope.map.zoom = 14;
          $scope.map.center = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          };
          isMarkerCanChange = false;
        }                           //comment to work on browser
        else {                      //comment to work on browser
          $scope.requestLocation(); //comment to work on browser
        }                           //comment to work on browser
      });                           //comment to work on browser
    };

    $scope.$watch('data.location.formatted_address', function(newValue) {
      if (newValue == undefined) {
        $scope.allowMarkerChange('', 'name');
      } else {
        $ionicLoading.show();
        $scope.locationSearch();
      }
    });

    $scope.locationSearch = function() {
      var lat = $scope.data.location.geometry.location.lat();
      var long = $scope.data.location.geometry.location.lng();
      $scope.markers.push(Search.getInputLocation(lat, long));
      $scope.loading = true;
      // $ionicLoading.show({
      //   template: '<p>Searching. . .</p><ion-spinner icon="lines"></ion-spinner>'
      // });
      Search.getRestaurant().on("child_added", function(snapshot) {
        if(snapshot) {
          $ionicLoading.hide();
          $scope.loading = false;
        }
        if (Search.getNearLocation(snapshot.key, snapshot.val(), lat, long)) {
          var m = Search.getNearLocation(snapshot.key, snapshot.val(), lat, long);
          $scope.markers.push(m.marker);
          $scope.restaurants.push(m.restaurant);
        }
      })


      $scope.map.zoom = 14;
      $scope.map.center = {
        latitude: $scope.data.location.geometry.location.lat(),
        longitude: $scope.data.location.geometry.location.lng()
      };
      isMarkerCanChange = false;
    };

    $scope.allowMarkerChange = function(inputText, filter) {
      var input = inputText.toLowerCase();
      $scope.markers.length = 0;
      if (input !== '') {
        $scope.loading = true;
        if (filter == 'name') {
          Search.searchName(input).$loaded().then(function(data) {
            if (data.length <= 0) {
              ionicToast.show('NO RESTAURANTS MAN', 'bottom', false, 2500);
            }
            $scope.loading = false;
            $scope.restaurants = data;
          });
        } else if (filter == 'menu') {
          var results = [];
          const items = [];
          Search.searchMenu(input).once('value', snap => {
            snap.forEach(item => { items.push(item) });
            if (items.length == 0) {
              $scope.restaurants = items;
              ionicToast.show('NO RESTAURANTS MAN', 'bottom', false, 2500);
              $scope.loading = false;
              $scope.$apply();
            }
          });
          Search.searchMenu(input).on("child_added", function(snapshot) {
            Search.getRestaurants(snapshot.val().restaurant_id).$loaded().then(function(rest) {
              results.push(rest);
              $scope.restaurants = results;
            })
          })
        }
      } else {
        $scope.restaurants = []
        $scope.loading = false;
      }
      $scope.map.zoom = 12;
      $scope.map.center.latitude = 10.729984;
      $scope.map.center.longitude = 122.549298;
      isMarkerCanChange = true;
    }

    $scope.CallNumber = function(number) {
      window.plugins.CallNumber.callNumber(function() {
        console.log("call success");
      }, function() {
        console.log("call failed");
      }, number)
    };

    $scope.searchFilter = [{
      text: "Name",
      value: "name"
    }, {
      text: "Menu",
      value: "menu"
    }, {
      text: "Location",
      value: "location"
    }];

    $scope.data = {
      filter: 'name'
    };

    $scope.clearField = function() {
      $scope.searchRestaurant = '';
      $scope.allowMarkerChange('', 'name');
    }

    $scope.clearLocationField = function() {
      if($scope.data.location) {
        $scope.data.location.formatted_address = "";
      }
      $scope.allowMarkerChange('', 'location');
    }

    $scope.requestLocation = function() {
      cordova.plugins.diagnostic.isLocationAvailable(function(available) {
        console.log("Location is " + (available ? "available" : "not available"));
        if(!available) {
          cordova.plugins.locationAccuracy.request(function(success) {
            console.log("Successfully requested accuracy: "+success.message);
            $scope.isLocationAvailable = true;
            $scope.$apply();
          }, function(error) {
            console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
             if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                 if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                     cordova.plugins.diagnostic.switchToLocationSettings();
                 }
             }
          }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        } else {
          $scope.isLocationAvailable = true;
        }
      }, function(error) {
        console.error("The following error occurred: "+error);
      });
    }

  }
]);
