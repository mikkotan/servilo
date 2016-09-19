app.controller("CartCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject",
  "CartData","User","$stateParams",
  function($scope ,$firebaseAuth ,$firebaseArray ,$firebaseObject, CartData, User ,$stateParams){

var total = [];

$scope.cart = CartData.get();

function price(){
  $scope.cart.forEach(function(order){
    var sub = order.quantity * order.price;
    total.push(sub);
    console.log("this is total "+total)
  });
}

price();



$scope.subtotal = function(price , quantity){
    var subtotal = price * quantity;
    return subtotal;
  };

function add(a, b) {
    return a + b;
}

$scope.getTotalPrice = function(){
let totalPrice = total.reduce(add, 0);
  return totalPrice;
};

$scope.buy = function(cart){
$scope.order = Order.all();
  $scope.order.$add({
    restaurant_id : $stateParams.restaurantId,
    customer : firebase.auth().currentUser.uid,
    menus : cart
  });

}

}]);
