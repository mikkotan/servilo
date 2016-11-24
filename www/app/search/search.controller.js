app.controller('SearchTabCtrl',
  ["$scope","Auth", "$state", "User", "ionicMaterialInk", "$ionicPopup", "CordovaGeolocation", "$ionicLoading", "restaurants",
    function($scope, Auth, $state, User, ionicMaterialInk, $ionicPopup, CordovaGeolocation, $ionicLoading, restaurants) {

  console.log('SearchTabCtrl');
  // $scope.usersRefObj = Database.users(); //new
  // Database.restaurants().$loaded().then(function() {
  //   console.log($scope.restaurants.length);
  // }); //try
  $scope.restaurants = restaurants; //new
  // $scope.getAvg = Restaurant.getAveragePrice;
  // $scope.getAvgRating = Restaurant.getAverageRating;
  // $scope.getReviewer = Review.reviewer;
  // $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;
  // $scope.RestaurantService = Restaurant;

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      User.setOnline(firebaseUser.uid);
    }
  })

  ionicMaterialInk.displayEffect();

  $scope.rating = {
    rate : 0,
    max: 5
  }

  $scope.currentLocation ={};
  $scope.markers = [];

  $scope.isMarkerCanChange = true;
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
    if(  $scope.isMarkerCanChange){
      $scope.markers.length = 0;
      for (var i = 0; i < items.length; i++) {
        $scope.markers.push({id: items[i].$id,
          coords: {latitude:items[i].latitude, longitude:items[i].longitude}
        });
      }
    }
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
      if(model.id != '0'){
        $state.go("tabs.viewRestaurant",{restaurantId:model.id});
      }
    }
  };
  $scope.mapText = "Nearest restaurant in 1km";
  $scope.showNear =function(){
    if($scope.mapText == "Nearest restaurant in 1km"){
      $scope.mapText = "Back to Default";
      $scope.currentLocation = CordovaGeolocation.get();
      $scope.tempMarkers = [];
      for (var i = 0; i < $scope.markers.length; i++) {
        var p1 = new google.maps.LatLng($scope.markers[i].coords.latitude, $scope.markers[i].coords.longitude);
        var p2 = new google.maps.LatLng($scope.currentLocation.latitude, $scope.currentLocation.longitude);

        if(calculateDistance(p1,p2)<= 1){
          $scope.tempMarkers.push({id: $scope.markers[i].id,
            coords: $scope.markers[i].coords
          });
        }
      }

      $scope.markers.length =0;
      $scope.markers = $scope.tempMarkers;
      $scope.markers.push({id:0,
        coords:{latitude: $scope.currentLocation.latitude, longitude:$scope.currentLocation.longitude},
        icon: {
          url: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=glyphish_user|edge_bc|FFBB00|000000|You+Are+Here',
          scaledSize: new google.maps.Size(83, 30)
        }
      });
      $scope.map.zoom = 14;
      $scope.map.center ={latitude: $scope.currentLocation.latitude, longitude:$scope.currentLocation.longitude };
      $scope.isMarkerCanChange = false;
      if( $scope.tempMarkers.length == 1){
        alert("There are no restaruant nearby!!");
      }
    }
    else {
      $scope.allowMarkerChange();
      $scope.mapText = "Nearest restaurant in 1km";
    }
  };

  var calculateDistance = function(point1, point2){
    return(google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000).toFixed(2);
  };

  $scope.allowMarkerChange = function(){
    $scope.map.zoom = 12;
    $scope.isMarkerCanChange = true;
  }

  $scope.CallNumber = function(number){
     window.plugins.CallNumber.callNumber(function(){
      console.log("call success");
     }, function(){
       console.log("call failed");
     }, number)
   };

}]);
