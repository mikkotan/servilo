app.controller('SearchTabCtrl', ["$scope", "Auth", "$state", "User", "ionicMaterialInk", "$timeout", "$ionicPopup", "CordovaGeolocation", "ionicToast", "$ionicLoading", "Search", "currentGeoLocation", "Restaurant", "$ionicActionSheet",
  function($scope, Auth, $state, User, ionicMaterialInk, $timeout, $ionicPopup, CordovaGeolocation, ionicToast, $ionicLoading, Search, currentGeoLocation, Restaurant, $ionicActionSheet) {

    ionicMaterialInk.displayEffect();
    $scope.$on('ngLastRepeat.workorderlist',function(e) {
      $scope.materialize();
    });

    $scope.materialize = function(){
      $timeout(function(){
        // ionicMaterialMotion.fadeSlideInRight();
        ionicMaterialInk.displayEffect();
        },0);
    };

    $scope.changeFilter = function() {
      console.log("clicked filter")
      var confirmPopup = $ionicPopup.alert({
        title: 'Search by',
        templateUrl: 'app/search/_search.filter.html',
        scope: $scope
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
        } else {
         console.log('You are not sure');
        }
      });
    }

    $scope.showActionsheet = function(restaurant) {
      $ionicActionSheet.show({
        titleText: '<p class="capitalize">' + restaurant.name + '</p>',
        buttons: [
          { text: '<i class="icon ion-arrow-right-b"></i> View' },
          { text: '<i class="icon ion-ios-telephone"></i> Call' }
        ],
        // destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          console.log("ari ko d??")
          switch(index) {
            case 0:
              $state.go("tabs.viewRestaurant.main", {"restaurantId":restaurant.$id});
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
      console.log('WATCH COLLECTION BEING RUN');
      $scope.newRestaurants = newRestaurants.map(function(restaurant) {
        console.log('hehe hellow')
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

    // $scope.$watchCollection('notifs', function(newNotifs) {
    //   $scope.newNotifs = newNotifs.map(function(notification) {
    //     var n = {
    //       getObject : Notification.getOne(notification.$id).$loaded()
    //         .then((notif) => {
    //         User.getUser(notif.sender_id).$loaded().then((user) => {
    //           Restaurant.get(notif.restaurant_id).$loaded()
    //             .then((restaurant) => {
    //               n.restaurant_name = restaurant.name
    //               n.sender = user.firstName + " " + user.lastName
    //               n.status = notif.status;
    //               n.type = notif.type;
    //               n.timestamp = notif.timestamp;
    //               n.order_no = notif.order_no;
    //               n.ready = true
    //               n.self = notif
    //             })
    //             .catch((err) => {
    //               console.log(JSON.stringify(err))
    //             })
    //         })
    //       })
    //     }
    //
    //     return n;
    //   })
    // })

    // Auth.$onAuthStateChanged(function(firebaseUser) {
    //   if (firebaseUser) {
    //     User.setOnline(firebaseUser.uid);
    //   }
    // })

    $scope.addMarkers = function(item) {
      $scope.markers.push(Search.getMarker(item));
    };

    $scope.markerEvents = {
      click: function(marker, eventName, model) {
        if (model.id != '0') {
          $state.go("tabs.viewRestaurant.main", {
            restaurantId: model.id
          });
        }
      }
    };

    $scope.showNear = function() {
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
    };

    $scope.$watch('data.location.formatted_address', function(newValue){
      if(newValue == undefined){
        console.log('Empty');
        $scope.allowMarkerChange('', 'name');
      } else {
        console.log('Has content');
        $ionicLoading.show();
        $scope.locationSearch();
      }
    });

    $scope.locationSearch = function() {
      console.log($scope.data.location.geometry.location)
      var lat = $scope.data.location.geometry.location.lat();
      var long = $scope.data.location.geometry.location.lng();
      $scope.markers.push(Search.getInputLocation(lat, long));
      $scope.loading = true;
      // $ionicLoading.show({
      //   template: '<p>Searching. . .</p><ion-spinner icon="lines"></ion-spinner>'
      // });
      Search.getRestaurant().on("child_added", function(snapshot) {
        if (Search.getNearLocation(snapshot.key, snapshot.val(), lat, long)) {
          $ionicLoading.hide();
          $scope.loading = false;
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
          Search.searchMenu(input).on("child_added", function(snapshot) {
            Search.getRestaurants(snapshot.val().restaurant_id).$loaded().then(function(rest) {
              results.push(rest);
              $scope.restaurants = results;
            })
          })
        }
      } else {
        $scope.restaurants = []
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
      $scope.data.location.formatted_address = undefined;
      $scope.allowMarkerChange('', 'location');
    }
  }
]);
