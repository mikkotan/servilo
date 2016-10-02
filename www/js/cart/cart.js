app.controller("CartCtrl",["$scope","CartData","orders","authUser","restaurantId","Cart",
  function($scope , CartData ,orders,authUser,restaurantId,Cart){

$scope.order = orders;
$scope.restaurantId = restaurantId
$scope.cartData = CartData.get()
$scope.totalPrice = CartData.totalPrice()


$scope.add = function(orderMenu){
  var order = $scope.cartData.indexOf(orderMenu);
  $scope.cartData[order].quantity += 1;

}

$scope.minus = function(orderMenu){
  var menu = $scope.cartData.indexOf(orderMenu);
  var menuId = Cart.menuId($scope.totalPrice,"id",orderMenu.id)

  if($scope.cartData[menu].quantity > 0){
    $scope.cartData[menu].quantity -= 1;
      if($scope.cartData[menu].quantity <= 0){
        $scope.cartData.splice(menu,1);
        $scope.totalPrice.splice(menuId,1)
      }
  }
}

$scope.delete = function(orderMenu){
    var menu = $scope.cartData.indexOf(orderMenu);
    var menuId = Cart.menuId($scope.totalPrice,"id",orderMenu.id)
    $scope.cartData.splice(menu,1);
    $scope.totalPrice.splice(menuId,1)

};

$scope.$watch('cartData',function(newArray){
  $scope.menus = newArray.map(function(menu){
    if(Cart.menuId($scope.totalPrice,"id",menu.id) === null){
      $scope.totalPrice.push({id:menu.id, price:menu.price * menu.quantity});
    }else{
      var menuid = Cart.menuId($scope.totalPrice,"id",menu.id)
      $scope.totalPrice[menuid].price = menu.price * menu.quantity
    }
    return {
        menu : menu,
        subtotal : menu.price * menu.quantity
    }
  })
},true);


$scope.$watch('totalPrice',function(newValue){
      var price = 0;
      for (var i = 0; i < newValue.length; i++) {
        price += newValue[i].price;
      }
      $scope.total = price;
},true);


var scanCart = function(Cart){
  var scanMenu = []
    for (var i = 0; i < Cart.length; i++) {
      scanMenu.push({id:Cart[i].menu.id , quantity:Cart[i].menu.quantity});
    }
    return scanMenu;
}

$scope.buy = function(cart , location){
    if(typeof location !== "undefined"){
      $scope.order.$add({
        restaurant_id : restaurantId,
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
