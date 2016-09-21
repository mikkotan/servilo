app.controller("MenuCtrl",["$scope","$firebaseAuth",
"$firebaseArray","$firebaseObject", "Menu","$stateParams","$state",
"$ionicModal", "$ionicListDelegate","CartDataService", "Database", "Restaurant",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams ,
    $state, $ionicModal, $ionicListDelegate,CartDataService, Database, Restaurant){

  var restaurantId = $stateParams.restaurantId;

  $scope.menus = Menu.all();
  $scope.getRestaurant = Menu.getRestaurant;
  // $scope.getRestaurantMenus = Menu.getRestaurantMenus(restaurantId);


  $scope.restaurant = function(restid){
    var rest = Menu.getRestaurant(restid);
    return  restid;
  }

  $scope.addMenu = function(menu){
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : restaurantId,
      prevPrice : menu.price,
      timestamp : firebase.database.ServerValue.TIMESTAMP
    }).then(function(menuObj){
      Database.restaurantsReference().child(restaurantId).child("menus").child(menuObj.key).set(true);
    })
    $state.go('tabs.restaurant');
  }
  //   {{{{{{{  ADD TO CART  }}}}}}}---------------------------------------------->

  $scope.addToCart = function(menu){
    console.log("Cliked!!");
    console.log(menu)
    $scope.id = menu.$id;
    $scope.menuName = menu.name;
    $scope.menuPrice = menu.price;
    $scope.restaurant_id = menu.restaurant_id;
    $scope.addToCartModal.show();
  };

  $scope.sendToCart = function(menu){
    var menuCart = {id:$scope.id, name:$scope.menuName, price : $scope.menuPrice , quantity:menu.quantity};
    CartDataService.add(menuCart);
    console.log(CartDataService.get())
    $state.go("tabs.menu")
    $scope.addToCartModal.hide();
  }

  $ionicModal.fromTemplateUrl('templates/add-to-cart-modal.html', function(addToCartModal) {
    $scope.addToCartModal = addToCartModal;
  }, {
    scope: $scope  /// GIVE THE MODAL ACCESS TO PARENT SCOPE
  });


  // {{{{{{{{{{{{{{{ END }}}}}}}}}}}}}}}--------------------------------------------->

  $scope.deleteMenu = function(menu) {
    Database.restaurantsReference().child(menu.restaurant_id).child('menus').child(menu.$id).set(null);
    $scope.restaurantMenus.$remove(menu);
  }

  $scope.editMenu = function(menu) {
    console.log("editButtonModal clicked");
    $scope.menu = menu;
    $scope.menuEditModal.show();
  }

  $scope.closeEditMenu = function() {
    $scope.menuEditModal.hide();
  }

  $scope.updateMenu = function(menu) {

    Database.menusReference().child(menu.$id).update({
      name : menu.name,
      price : menu.price
    });

    $scope.menuEditModal.hide();
    $ionicListDelegate.closeOptionButtons();
  }

  $ionicModal.fromTemplateUrl('templates/edit-menu.html', function(modalEditMenu) {
    $scope.menuEditModal = modalEditMenu;
  }, {
    scope: $scope
  });

  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Restaurant.getMenus(restaurantId);
    // $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
  }

}]);
