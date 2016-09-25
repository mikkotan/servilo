app.controller("ViewRestaurantMenuOrder",["$scope","$state","restaurantMenus",'$stateParams', "CartData","$ionicModal",
  function($scope ,$state , restaurantMenus,$stateParams, CartData,$ionicModal){

console.log("View Order Menu");

$scope.restaurantId = $stateParams.restaurantId
$scope.restaurantMenus = restaurantMenus;

  $scope.addToCart = function(menu) {
    console.log("Cliked!!");
    $scope.id = menu.$id;
    $scope.menuName = menu.name;
    $scope.menuPrice = menu.price;
    $scope.addToCartModal.show();
  };

  var menuId = function(array, key, value){
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
      }
      return null;
  }

  $scope.sendToCart = function(menu){
    if(menuId(CartData.get(),"id",$scope.id) == null){
      var menuCart = { id:$scope.id, name:$scope.menuName, price : $scope.menuPrice , quantity:menu.quantity };
      CartData.add(menuCart);
      $state.go("tabs.restaurantMenus");
      $scope.addToCartModal.hide();
    }
    else {
      CartData.get().map(function(order){
              if(order.id == $scope.id){
                order.quantity = order.quantity + menu.quantity;
                $state.go("tabs.restaurantMenus");
                $scope.addToCartModal.hide();
              }
      });
    };
  }


  $ionicModal.fromTemplateUrl('templates/add-to-cart-modal.html', function(addToCartModal) {
    $scope.addToCartModal = addToCartModal;
  }, {
    scope: $scope
  });


}]);
