app.controller("ViewRestaurantMenu",["$scope","$stateParams","restaurantMenu", "$ionicModal","Database","$ionicListDelegate",
  function($scope ,$stateParams,restaurantMenu ,$ionicModal,Database , $ionicListDelegate){

  $scope.restaurantMenus = restaurantMenu

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
    }).then(function(){
      $scope.closeEditMenu();
    })
  }


  $ionicModal.fromTemplateUrl('templates/edit-menu.html', function(modalEditMenu) {
    $scope.menuEditModal = modalEditMenu;
  }, {
    scope: $scope
  });

}]);
