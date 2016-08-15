app.controller("MenuCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject", "Menu","$stateParams","$state",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams , $state){



  var restaurantId = $stateParams.restaurantId;



  $scope.menus = Menu.all();
  $scope.getRestaurant = Menu.getRestaurant;

  var storageRef = firebase.storage().ref();
  var mountainsRef = storageRef.child('img/wow.jpg');


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
    $state.go('tabs.restaurant');
  }


  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
        console.log("34"+Menu.getRestaurant(restaurantId));
  }

}]);
