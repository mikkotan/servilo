app.controller("CartCtrl",["$scope","CartData","orders","authUser","restaurantId","Cart", "Database", "Restaurant",
  function($scope , CartData ,orders,authUser,restaurantId,Cart, Database, Restaurant){

$scope.order = orders;
$scope.restaurantId = restaurantId
$scope.cartData = CartData.get();
$scope.totalPrice = CartData.totalPrice();

$scope.add = function(orderMenu){
  var order = $scope.cartData.indexOf(orderMenu);
  $scope.cartData[order].quantity += 1;

}

$scope.minus = function(orderMenu){
  var menu = $scope.cartData.indexOf(orderMenu);
  var menuId = Cart.menuId($scope.totalPrice,"id",orderMenu.id)

  if ($scope.cartData[menu].quantity > 0) {
    $scope.cartData[menu].quantity -= 1;
    if ($scope.cartData[menu].quantity <= 0) {
      $scope.cartData.splice(menu,1);
      $scope.totalPrice.splice(menuId,1);
    }
  }
};

$scope.delete = function(orderMenu) {
    var menu = $scope.cartData.indexOf(orderMenu);
    var menuId = Cart.menuId($scope.totalPrice,"id",orderMenu.id)
    $scope.cartData.splice(menu,1);
    $scope.totalPrice.splice(menuId,1)
};

$scope.$watch('cartData',function(newArray) {
  $scope.menus = newArray.map(function(menu){
    if (Cart.menuId($scope.totalPrice,"id",menu.id) === null) {
      $scope.totalPrice.push({id:menu.id, price:menu.price * menu.quantity});
    }
    else {
      var menuid = Cart.menuId($scope.totalPrice,"id",menu.id)
      $scope.totalPrice[menuid].price = menu.price * menu.quantity
    }
    return {
        menu : menu,
        subtotal : menu.price * menu.quantity
    }
  })
},true);

// $scope.$watch('data.orderVal.pickupTime', function(newValue){
//   console.log("NEW VALUE OKAY++ "+newValue);
//   $scope.data.orderVal.pickupTime = newValue.getTime();
// })


$scope.$watch('totalPrice',function(newValue) {
      var price = 0;
      for (var i = 0; i < newValue.length; i++) {
        price += newValue[i].price;
      }
      $scope.total = price;
},true);


var scanCart = function(Cart) {
  var scanMenu = []
    for (var i = 0; i < Cart.length; i++) {
      scanMenu.push({
        id : Cart[i].menu.id,
        quantity : Cart[i].menu.quantity,
      });
    }
    return scanMenu;
}

$scope.buy = function(cart , location) {
    if (typeof location !== "undefined") {
      $scope.order.$add({
        restaurant_id : restaurantId,
        customer_id : authUser.$id,
        order_details: {
          location : location,
          menus : scanCart(cart),
          totalprice : $scope.total,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          status: 'pending',
        },
        orderStatus : {
          cancelled : false,
          confirmed : false,
          done : false,
          onDelivery : false,
          delivered : false
        },
      }).then(function() {
          CartData.get().length = 0;
          CartData.totalPrice().length = 0;
          var restaurant_owner = Restaurant.getOwner(restaurantId);
          Database.notifications().$add({
            sender_id : authUser.$id,
            receiver_id : restaurant_owner.$id,
            restaurant_id : restaurantId,
            type : 'order',
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
          alert("success")
      }).catch(function(error) {
            alert(error);
            console.log(error);
      });
    }
    else {
      alert("please fill up Location");
    }
  }

}]);
