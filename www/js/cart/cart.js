app.controller("CartCtrl",["$scope","CartData","$stateParams","orders","authUser","restaurantId",
  function($scope , CartData ,$stateParams,orders,authUser,restaurantId){

var total = [];

$scope.order = orders;

$scope.restaurantId = restaurantId;
console.log($scope.restaurantId);

$scope.cartData = CartData.get()

$scope.$watchCollection('cartData', function(newMenus){
  var totalPrice = [];

  $scope.menus = newMenus.map(function(menu){
    totalPrice.push(menu.price * menu.quantity)
    return {
        menu:menu,
        subtotal : menu.price * menu.quantity
    }
  })
  Promise.all([$scope.menus]).then(function(){
    $scope.totalPrice = totalPrice.reduce(add, 0);
  })
})




function add(a, b) {
    return a + b;
}


var scanCart = function(Cart){
  var scanMenu = []
    for (var i = 0; i < Cart.length; i++) {
      scanMenu.push({id:Cart[i].menu.id , quantity:Cart[i].menu.quantity});
    }
    return scanMenu;

}

$scope.buy = function(cart , location){
  console.log(typeof location);
    if(typeof location !== "undefined"){
      $scope.order.$add({
        restaurant_id : $scope.restaurantId,
        customer_id : authUser.$id,
        location : location,
        menus : scanCart(cart)
      }).then(function(){
          $scope.menus.length = 0;
          alert("success")
      }).catch(function(error){
            alert(error);
      });
    }else{
      alert("please fill up Location");
    }


  }
}]);
