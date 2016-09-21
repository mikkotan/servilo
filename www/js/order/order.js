app.controller("OrderCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject","CartDataService","Order",
  function($scope ,$firebaseAuth ,$firebaseArray ,$firebaseObject, CartDataService,Order){

$scope.orders = Order.getOrders();
$scope.restaurants = Order.restaurants();


}]);
