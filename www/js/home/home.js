app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "$stateParams", "$state", "ionicMaterialInk",
function($scope, $ionicModal, $firebaseArray , currentAuth , Restaurant ,$stateParams ,$state, ionicMaterialInk) {
  // console.log('HomeTabCtrl');
  ionicMaterialInk.displayEffect();

  $scope.restaurants = Restaurant.all();

  var id = $stateParams.restaurantId

  if($state.is("tabs.viewRestaurant")){
    $scope.restaurant = Restaurant.get(id);
    console.log(id)
  }
}]);
