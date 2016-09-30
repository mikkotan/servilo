app.controller("ViewRestaurantMenuOrder",["$scope","$state","restaurantMenus",'$stateParams', "CartData","$ionicModal",
  function($scope ,$state , restaurantMenus,$stateParams, CartData,$ionicModal){

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

  var closeModal = function(){
    $state.go("tabs.restaurantMenus");
    $scope.addToCartModal.hide();
  }

  $scope.sendToCart = function(menu){
    var menuOrder = menuId(CartData.get(),"id",$scope.id);

    if( menuOrder === null){
      var menuCart = { id:$scope.id, name:$scope.menuName, price : $scope.menuPrice , quantity:menu.quantity };
      CartData.add(menuCart);
      $state.go("tabs.restaurantMenus");
      closeModal();
    }
    else {
      var cartMenu = CartData.get()[menuOrder];
      cartMenu.quantity = cartMenu.quantity + menu.quantity;
      closeModal();
    }
  }

  $ionicModal.fromTemplateUrl('templates/add-to-cart-modal.html', function(addToCartModal) {
    $scope.addToCartModal = addToCartModal;
  }, {
    scope: $scope
  });


}]);
