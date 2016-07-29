app.controller("MenuCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject", "Menu","$stateParams","$state",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams , $state){

  $scope.menu = Menu.all();

  var restaurantId = $stateParams.restaurantId;

  $scope.addMenu = function(menu){
    console.log("wew")
    $scope.menu.$add({
      name : menu.name,
      restaurant_id : restaurantId
    })
  }



  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
    console.log("view resturant menus state");
  }

}]);
