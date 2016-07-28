app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "$stateParams", "$state",
function($scope, $ionicModal, $firebaseArray , currentAuth , Restaurant ,$stateParams ,$state) {
  console.log('HomeTabCtrl');


    $scope.restaurants = Restaurant.all();

      var id = $stateParams.restaurantId;

      if($state.is("tabs.viewRestaurant")){
      $scope.restaurant = Restaurant.get(id);
      console.log(id)
    }


}]);
