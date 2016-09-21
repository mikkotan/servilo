app.controller("CartCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject",
  "CartData","User","$stateParams","Cart",
  function($scope ,$firebaseAuth ,$firebaseArray ,$firebaseObject, CartData, User ,$stateParams,Cart){

var total = [];
$scope.restaurantId = $stateParams.restaurantId

$scope.order = Cart.order();
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
  console.log("click")



  $scope.order.$add({
    restaurant_id : $scope.restaurantId,
    customer : firebase.auth().currentUser.uid,
    menus : cart
  }).then(function(){
      $scope.cart = [];
      alert("success")
    .catch(function(){
      alert("error")
    });
  });

}

}]);
