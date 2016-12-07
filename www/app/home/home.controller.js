app.controller('HomeTabCtrl',
  ["$scope","$ionicModal", "$state", "ionicMaterialInk", "$ionicLoading", "Home", "$timeout","User","Auth","CordovaGeolocation",
    function($scope, $ionicModal, $state, ionicMaterialInk, $ionicLoading, Home, $timeout,User,Auth, CordovaGeolocation) {

  var vm = this;
  $scope.currentLocation = CordovaGeolocation.get();

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      User.setOnline(firebaseUser.uid);
      User.isAdmin(firebaseUser.uid).then(function(val){console.log("ADMIN: " + val)})
      User.isUser(firebaseUser.uid).then(function(val){console.log("USER: " + val)})
      User.isRestaurantOwner(firebaseUser.uid).then(function(val){console.log("RESTAURANT_OWNER: " + val)})
    }
  });

  console.log('HomeTabCtrl');
  vm.restaurants = Home.srestaurants();
  vm.noMoreItemsAvailable = false;

  $scope.loadMore = function() {
    Home.srestaurants().$loaded().then(function(x) {
      lastKey = Home.getLastKey(vm.restaurants);
      Home.nextRestaurants(lastKey).$loaded().then(function(data) {
        if(data.length <= 0) {
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

  $scope.searchChange = function(name) {
    if(name !== '') {
      // first solution
      // var results = [];
      // Home.search(name).on("child_added", function(snapshot) {
      //   results.push(snapshot.val());
      //   vm.restaurants = results;
      //   $scope.$apply();
      // })

      // second solution
      Home.search(name).$loaded().then(function(data) {
        if(data.length <= 0) {
          console.log('no results found! :(');
        }
        vm.restaurants = $scope.solveDistances(data);
        console.log(vm.restaurants);
      });
    }
    else {
      vm.restaurants = Home.srestaurants();
    }
  }

  $scope.solveDistances = function(data){
    angular.forEach(data, function(restaurant){
      $scope.getDistance(restaurant);
    });
    return data;
  }

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

}]);
