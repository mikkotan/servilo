app.controller("ViewRestaurantMenu", ["$scope", "$stateParams", "restaurantMenu", "$ionicModal", "Database", "$ionicListDelegate",
  function($scope, $stateParams, restaurantMenu, $ionicModal, Database, $ionicListDelegate) {

    $scope.restaurantMenus = restaurantMenu

    $scope.deleteMenu = function(menu) {
      console.log('Delete called');
      $scope.restaurantMenus.$remove(menu)
        .then((ref) => {
          Database.restaurantsReference().child(menu.restaurant_id).child('menus').child(menu.$id).set(null);
          Database.restaurantsReference().child(menu.restaurant_id).child('menu_categories').child(menu.category_id).child('menus').child(menu.$id).set(null);
        })
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
        name: menu.name,
        price: menu.price
      }).then(function() {
        $scope.closeEditMenu();
      })
    }

    $scope.changeAvailability = function(menu) {
      console.log("update " + menu.availability)
      Database.menusReference().child(menu.$id).update({
        availability: menu.availability,
      })
    }

    $ionicModal.fromTemplateUrl('app/menu/_edit-menu.html', function(modalEditMenu) {
      $scope.menuEditModal = modalEditMenu;
    }, {
      scope: $scope
    });

  }
]);
