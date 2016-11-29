app.controller('SearchTabCtrl',
  ["$scope","Auth", "$state", "User", "ionicMaterialInk", "$ionicPopup", "CordovaGeolocation", "$ionicLoading", "Search",
    function($scope, Auth, $state, User, ionicMaterialInk, $ionicPopup, CordovaGeolocation, $ionicLoading, Search) {

  console.log('SearchTabCtrl');
  // $scope.usersRefObj = Database.users(); //new
  // Database.restaurants().$loaded().then(function() {
  //   console.log($scope.restaurants.length);
  // }); //try

  $scope.restaurantOrder = "name";

  $scope.restaurants = []; //new
  // $scope.getAvg = Restaurant.getAveragePrice;
  // $scope.getAvgRating = Restaurant.getAverageRating;
  // $scope.getReviewer = Review.reviewer;
  // $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;
  // $scope.RestaurantService = Restaurant;

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      User.setOnline(firebaseUser.uid);
      User.isAdmin(firebaseUser.uid).then(function(val){console.log("ADMIN: " + val)})
      User.isUser(firebaseUser.uid).then(function(val){console.log("USER: " + val)})
      User.isRestaurantOwner(firebaseUser.uid).then(function(val){console.log("RESTAURANT_OWNER: " + val)})

    }
  })

  ionicMaterialInk.displayEffect();

  $scope.rating = {
    rate : 0,
    max: 5
  }

  $scope.markers = [];

  var isMarkerCanChange = true;
  $scope.map =  {center: { latitude: 10.729984, longitude: 122.549298 }, zoom: 12, options: {scrollwheel: false}, bounds: {}, control:{}, refresh: true,
    events : {
      tilesloaded: function (map) {
        $scope.$apply(function () {
          google.maps.event.trigger(map, "resize");
        });
      }
    }
  };

  $scope.currentLocation = CordovaGeolocation.get();
  $scope.addMarkers = function(items){
    if(isMarkerCanChange){
      $scope.markers.length = 0;
      for (var i = 0; i < items.length; i++) {
        $scope.markers.push({
          id: items[i].$id,
          coords: {
            latitude:items[i].latitude,
            longitude:items[i].longitude
          }
        });
      }
    }
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
      if(model.id != '0'){
        $state.go("tabs.viewRestaurant.main",{restaurantId:model.id});
      }
    }
  };
  $scope.mapText = "Nearest restaurant in 1km";
  $scope.showNear =function(){
    if($scope.mapText == "Nearest restaurant in 1km"){
      $scope.mapText = "Back to Default";
      $scope.currentLocation = CordovaGeolocation.get();
      $scope.loading = true;
      Search.getRestaurant().$loaded().then(function(result) {
        $scope.loading = false;
        $scope.markers = Search.getNearestRestaurants(result);
        // $scope.restaurants = $scope.markers;
        if($scope.markers.length == 1) {
          alert("There are no restaruant nearby!!");
        }
      })
      $scope.map.zoom = 14;
      $scope.map.center ={
        latitude: $scope.currentLocation.latitude,
        longitude:$scope.currentLocation.longitude
      };
      isMarkerCanChange = false;
    }
    else {
      $scope.allowMarkerChange('', 'name');
      $scope.mapText = "Nearest restaurant in 1km";
    }
  };

  $scope.allowMarkerChange = function(input, filter){
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
