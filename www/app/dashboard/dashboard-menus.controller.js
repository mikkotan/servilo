app.controller("DashboardMenusCtrl", ["$scope", "$stateParams", "$ionicModal", "Database", "$ionicListDelegate", "Menu", "$cordovaCamera", "Restaurant", "Upload", "$ionicLoading",
  function($scope, $stateParams, $ionicModal, Database, $ionicListDelegate, Menu, $cordovaCamera, Restaurant, Upload, $ionicLoading) {

    $scope.restoId = $stateParams.restaurantId;

    $scope.restaurant = Restaurant.get($stateParams.restaurantId);

    Restaurant.getCategories($scope.restoId).$loaded()
      .then((categories) => {
        $scope.categories = categories.map(function(category) {
          var c = {
            name: category.name,
            getMenus: Menu.getMenusFromCategories($scope.restoId, category.$id).$loaded()
              .then((menus) => {
                c.menus = menus.map(function(menu) {
                  var m = {
                    get: Menu.get(menu.$id).$loaded()
                      .then((menuObj) => {
                        m.details = menuObj
                      })
                  }
                  return m
                })
              })
          }
          return c
        })
      })

    Restaurant.getMenus($scope.restoId).$loaded()
      .then((menus) => {
        if (menus.length == 0) {
          $ionicLoading.hide()
        }
        $scope.restaurantMenus = menus

        $scope.$watchCollection('restaurantMenus', function(newRestaurantMenus) {
          $scope.menus = newRestaurantMenus.map(function(menu) {
            var m = {
              get: Menu.get(menu.$id).$loaded()
                .then((menuObj) => {
                  $ionicLoading.hide();
                  m.details = menuObj;
                  m.ready = true
                })
            }
            return m;
          })
        })
      })
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

    $scope.categories = Menu.getMenuCategories($stateParams.restaurantId);
    $scope.defaultCategory = $scope.categories[0];
    $scope.photoURL = "";


    $scope.showAddCategoryModal = function(resId) {
      $scope.category = {
        restaurant_id: $scope.restoId
      }
      $scope.addCategoryModal.show();
    }

    $scope.addCategory = function(category) {
      try {
        Restaurant.addCategory(category)
          .then(function() {
            console.log('ADDED CATEGORY!! ')
          })
        $scope.category.name = "";
        $scope.category.restaurant_id = "";
        $scope.addCategoryModal.hide();
      } catch (e) {
        $scope.submitError = true;
      }
    }


    $scope.upload = function(index) {
      navigator.camera.getPicture(function(imageData) {
        Upload.menu(imageData).then(function(downloadURL) {
          $scope.imageLoading = false;
          $scope.photoURL = downloadURL;
        })
      }, function(message) {
        console.log('Failed because: ' + message);
        $scope.imageLoading = false;
        $scope.$apply();
      }, Upload.getOptions(index));
      $scope.imageLoading = true;
    }

    $scope.openAddModal = function() {
      $scope.addMenuModal.show();
    }

    $scope.addMenu = function(menu) {
      try {
        Menu.create({
            name: menu.name.toLowerCase(),
            price: menu.price,
            restaurant_id: $scope.restoId,
            category_id: menu.category,
            availability: false,
            prevPrice: menu.price,
            photoURL: $scope.photoURL,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
          .then(() => {
            ionicToast.show('Added menu', 'bottom', false, 2500);
            // alert('Success');
            $scope.addMenuModal.hide();
          })
          .catch((err) => {
            alert(err);
          })
      } catch (e) {
        $scope.submitError = true;
      }
    }

    $scope.deleteMenu = function(menu) {
      $ionicLoading.show();
      return Menu.delete(menu.$id)
        .then(() => {
          $ionicLoading.hide()
          ionicToast.show('Menu deleted', 'bottom', false, 2500);
          alert('Menu successfully deleted.')
          console.log('Menu successfully deleted.')
        })
        .catch((err) => {
          console.log(err)
          $ionicLoading.hide()
          alert(err)
        })
    }

    $scope.editMenu = function(menu) {
      console.log("editButtonModal clicked");
      $scope.eMenu = menu;
      $scope.categories = Menu.getMenuCategories(menu.restaurant_id);
      $scope.menuEditModal.show();
      console.log(menu.category_id);
    }

    $scope.closeEditMenu = function() {
      $scope.menuEditModal.hide();
    }

    $scope.closeAddMenu = function() {
      $scope.addMenuModal.hide();
    }

    $scope.updateMenu = function(menu) {
      return Menu.update(menu)
        .then(() => {
          $scope.closeEditMenu()
        })
    }

    $scope.changeAvailability = function(menu) {
      return Menu.changeAvailability(menu)
    }

    $ionicModal.fromTemplateUrl('app/menu/_edit-menu.html', function(menuEditModal) {
      $scope.menuEditModal = menuEditModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/menu/_add-menu.html', function(addMenuModal) {
      $scope.addMenuModal = addMenuModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/menu/_add-category-modal.html', function(addCategoryModal) {
      $scope.addCategoryModal = addCategoryModal;
    }, {
      scope: $scope
    })


  }
]);
