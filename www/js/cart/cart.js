app.controller("CartCtrl",["$scope","CartData","$stateParams","orders","authUser","restaurantId",
  function($scope , CartData ,$stateParams,orders,authUser,restaurantId){

var total = [];

$scope.order = orders;

$scope.restaurantId = restaurantId;
console.log($scope.restaurantId);


$scope.menus = CartData.get()

function add(a, b) {
    return a + b;
}

$scope.buy = function(cart){
  $scope.order.$add({
    restaurant_id : $scope.restaurantId,
    customer_id : authUser.$id,
    menus : cart
  }).then(function(){
      $scope.menus.length = 0;
      alert("success")
  }).catch(function(error){
        alert(error);
  });

}

}]);
