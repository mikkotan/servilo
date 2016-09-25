app.controller("MenuCtrl",["$scope","$firebaseAuth",
  "$firebaseArray","$firebaseObject", "menus","$stateParams","$state",
    "$ionicModal", "$ionicListDelegate","CartData","Menu",
      function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, menus,$stateParams ,
          $state, $ionicModal, $ionicListDelegate,CartData,Menu){

  $scope.restaurantId = $stateParams.restaurantId;

  $scope.menus = menus ;

  $scope.getRestaurant = Menu.getRestaurant;




  $scope.addMenu = function(menu){
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : $scope.restaurantId,
      prevPrice : menu.price
    }).then(function(menuObj){

      var restaurantRef = firebase.database().ref().child("restaurants").child(restaurantId);
      var sumRef = restaurantRef.child("sumPrice");
      var menuCount = restaurantRef.child("totalMenuCount");
      var avgRate = restaurantRef.child("rating");

      restaurantRef.child("menus").child(menuObj.key).set(true);

      sumRef.transaction(function(currentPrice){
        console.log("Adding currentPrice");
        return currentPrice + menu.price;
      })

      menuCount.transaction(function(currentCount){
        console.log("Adding count");
        return currentCount+1;
      })

    })
    $state.go('tabs.restaurant');
  }


}]);
