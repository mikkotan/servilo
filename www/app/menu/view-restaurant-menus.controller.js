app.controller("ViewRestaurantMenu", ["$scope", "$stateParams", "restaurantMenu", "$ionicModal", "Database", "$ionicListDelegate", "Menu", "$ionicLoading",
  function($scope, $stateParams, restaurantMenu, $ionicModal, Database, $ionicListDelegate, Menu, $ionicLoading) {
    $ionicLoading.show();
    $scope.restaurantMenus = restaurantMenu;

    $scope.$watchCollection('restaurantMenus', function(newRestaurantMenus) {
      $scope.menus = newRestaurantMenus.map(function(menu) {
        var m = {
          get: Menu.get(menu.$id).$loaded()
            .then((menuObj) => {
              m.details = menuObj
              m.ready = true
              $ionicLoading.hide()
            })
        }
        return m;
      })
    })
    // $scope.categories = Menu.getMenuCategories(restaurantId);
    // $scope.restaurantMenus = Restaurant.getMenus($stateParams.restaurantId)

    $scope.deleteMenu = function(menu) {
      console.log('Delete called');
      return Menu.delete(menu.$id)
        .then(() => {
          console.log('Successfully deleted menu '+menu.$id)
        })
        .catch((err) => {
          console.log(err);
        })
      // $scope.restaurantMenus.$remove(menu)
      //   .then((ref) => {
      //     Database.restaurantsReference().child(menu.restaurant_id).child('menus').child(menu.$id).set(null);
      //     Database.restaurantsReference().child(menu.restaurant_id).child('menu_categories').child(menu.category_id).child('menus').child(menu.$id).set(null);
      //   })
    }

    $scope.editMenu = function(menu) {
      $scope.eMenu = menu;
      $scope.categories = Menu.getMenuCategories(menu.restaurant_id);
      $scope.menuEditModal.show();
      console.log(menu.category_id);
    }

    $scope.closeEditMenu = function() {
      $scope.menuEditModal.hide();
    }

    $scope.updateMenu = function(menu) {
      return Menu.update(menu)
        .then(() => {
          $scope.menuEditModal.hide();
        })
        .catch((err) => {
          console.log(err);
        })
    }

    $scope.changeAvailability = function(menu) {
      return Menu.changeAvailability(menu)
        .then(() => {
          console.log('success changed availability to ' + menu.availability)
        })
        .catch((err) => {
          console.log(err);
        })
    }

    $ionicModal.fromTemplateUrl('app/menu/_edit-menu.html', function(menuEditModal) {
      $scope.menuEditModal = menuEditModal;
    }, {
      scope: $scope
    });

  }
]);
