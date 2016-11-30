app.controller("ViewRestaurantMenu", ["$scope", "$stateParams", "restaurantMenu", "$ionicModal", "Database", "$ionicListDelegate", "Menu",
  function($scope, $stateParams, restaurantMenu, $ionicModal, Database, $ionicListDelegate, Menu) {

    $scope.restaurantMenus = restaurantMenu;
    // $scope.categories = Menu.getMenuCategories(restaurantId);

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
      console.log(JSON.stringify(menu));
      $scope.eMenu = menu;
      $scope.categories = Menu.getMenuCategories(menu.restaurant_id);
      $scope.menuEditModal.show();
      console.log(menu.category_id);
    }

    $scope.closeEditMenu = function() {
      $scope.menuEditModal.hide();
    }

    $scope.updateMenu = function(menu) {
      console.log(JSON.stringify(menu));
      Database.menusReference().child(menu.$id).update({
        name: menu.name,
        price: menu.price,
        category_id: menu.category
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

    $ionicModal.fromTemplateUrl('app/menu/_edit-menu.html', function(menuEditModal) {
      $scope.menuEditModal = menuEditModal;
    }, {
      scope: $scope
    });

  }
]);
