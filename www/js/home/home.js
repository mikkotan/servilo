app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Home", "$stateParams", "$state",
function($scope, $ionicModal, $firebaseArray , currentAuth , Home ,$stateParams ,$state) {
  console.log('HomeTabCtrl');


    $scope.restaurants = Home.restaurants();

      var id = $stateParams.restaurantId;

      if($state.is("tabs.viewRestaurant")){
      $scope.restaurant = Home.getRestaurant(id);
      console.log(id)
    }


}]);
