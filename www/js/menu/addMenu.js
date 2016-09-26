app.controller("AddMenuCtrl",["$scope","$stateParams","menus","$firebaseArray","$firebaseObject","$state","restaurantId",
  function($scope ,$stateParams,menus,$firebaseArray,$firebaseObject,$state,restaurantId){

    $scope.menus = menus;

    $scope.addMenu = function(menu){
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : restaurantId,
      prevPrice : menu.price,
      timestamp : firebase.database.ServerValue.TIMESTAMP
    }).then(function(menuObj){
      Database.restaurantsReference().child(restaurantId).child("menus").child(menuObj.key).set(true);
    })
    $state.go('tabs.restaurant');
  }

}]);
