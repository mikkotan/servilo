app.controller('SearchTabCtrl',
  ["$scope","Auth", "$state", "User", "ionicMaterialInk", "$ionicPopup", "CordovaGeolocation", "$ionicLoading", "Search", "currentGeoLocation", "Restaurant",
    function($scope, Auth, $state, User, ionicMaterialInk, $ionicPopup, CordovaGeolocation, $ionicLoading, Search, currentGeoLocation, Restaurant) {

  console.log('SearchTabCtrl');
  $scope.restaurants = [];
  $scope.markers = [];
  ionicMaterialInk.displayEffect();
  $scope.map = Search.getMap();
  var isMarkerCanChange = true;
  $scope.mapText = "Nearest restaurant in 1km";

  $scope.RestaurantService = Restaurant;
  $scope.rating = {
    rate : 0,
    max: 5
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
        details : restaurant,
        getAvg : Restaurant.getAverageRating(restaurant.$id)
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

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      User.setOnline(firebaseUser.uid);
    }
  })

  $scope.addMarkers = function(item){
    $scope.markers.push(Search.getMarker(item));
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
      if(model.id != '0'){
        $state.go("tabs.viewRestaurant.main",{restaurantId:model.id});
      }
    }
  };

  $scope.showNear = function() {
    if($scope.mapText == "Nearest restaurant in 1km") {
      $scope.mapText = "Back to Default";
      var currentLocation = CordovaGeolocation.get();
      $scope.markers.push(Search.getYouAreHere());
      $scope.loading = true;
      // $ionicLoading.show({
      //   template: '<p>Searching. . .</p><ion-spinner icon="lines"></ion-spinner>'
      // });
      Search.getRestaurant().on("child_added", function(snapshot) {
        if(Search.getNear(snapshot.key ,snapshot.val())) {
          $scope.loading = false;
          var getNear = Search.getNear(snapshot.key, snapshot.val());
          $scope.markers.push(getNear.marker);
          $scope.restaurants.push(getNear.restaurant);
        }
      })

      // Search.getRestaurant().$loaded().then(function(result) {
      //   // $ionicLoading.hide();
      //   $scope.markers = Search.getNearestRestaurants(result);
      //   // $scope.restaurants = $scope.markers;
      //   if($scope.markers.length == 1) {
      //     alert("There are no restaruant nearby!!");
      //   }
      // })
      $scope.map.zoom = 14;
      $scope.map.center = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      };
      isMarkerCanChange = false;
    }
    else {
      $scope.allowMarkerChange('', 'name');
      $scope.mapText = "Nearest restaurant in 1km";
    }
  };

  $scope.allowMarkerChange = function(inputText, filter){
    var input = inputText.toLowerCase();
    $scope.markers.length = 0;
    if(input !== '') {
      if(filter == 'name') {
        Search.searchName(input).$loaded().then(function(data) {
          if(data.length <= 0) {
            console.log('no results found! :(');
          }
          $scope.restaurants = data;
        });
      }
      else if(filter == 'menu') {
        var results = [];
        Search.searchMenu(input).on("child_added", function(snapshot) {
          Search.getRestaurants(snapshot.val().restaurant_id).$loaded().then(function(rest) {
            results.push(rest);
            $scope.restaurants = results;
          })
        })
      }
    }
    else {
      $scope.restaurants = []
    }
    $scope.map.zoom = 12;
    isMarkerCanChange = true;
  }

  $scope.CallNumber = function(number){
     window.plugins.CallNumber.callNumber(function(){
      console.log("call success");
     }, function(){
       console.log("call failed");
     }, number)
   };

  $scope.searchFilter = [
    { text: "Name", value: "name" },
    { text: "Menu", value: "menu" }
  ];

  $scope.data = {
    filter: 'name'
  };

}]);
