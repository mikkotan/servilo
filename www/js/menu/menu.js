app.controller("MenuCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject", "Menu","$stateParams","$state","Restaurant",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams , $state , Restaurant){

  var menus = Menu.all();
  var restaurantId = $stateParams.restaurantId;


  $scope.menus = function(){
    return menus;
  }




  $scope.restaurant = function(restid){
    var rest = Menu.getRestaurant(restid);
    return  restid;
  }



  $scope.addMenu = function(menu){
    console.log("wew")
    $scope.menus.$add({
      name : menu.name,
      restaurant_id : restaurantId
    })
  }



  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
        console.log("34"+Menu.getRestaurant(restaurantId));
  }

}]);
