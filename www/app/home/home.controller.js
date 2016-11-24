app.controller('HomeTabCtrl',
  ["$scope","$ionicModal", "$state", "ionicMaterialInk", "$ionicPopup", "$ionicLoading", "Home",
    function($scope, $ionicModal, $state, ionicMaterialInk, $ionicPopup, $ionicLoading, Home) {

  console.log('HomeTabCtrl');
  $scope.restaurants = Home.srestaurants();
  
  var lastKey = "";
  $scope.noMoreItemsAvailable = false;

  $scope.loadMore = function() {
    Home.srestaurants().$loaded().then(function() {
      lastKey = $scope.restaurants[$scope.restaurants.length-1].$id;
      console.log('lastKey: ' + lastKey)
      $scope.last = Home.nextRestaurants(lastKey);
      $scope.last.$loaded().then(function() {
        console.log($scope.last);
        if($scope.last.length <= 0) {
          $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.restaurants = $scope.restaurants.concat($scope.last);
      })
    })
  };

  $scope.doRefresh = function() {
    Home.srestaurants().$loaded().then(function(data) {
      $scope.restaurants = data;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.noMoreItemsAvailable = false;
    });
  };

}]);
