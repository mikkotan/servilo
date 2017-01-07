app.controller("DashboardMenusCtrl", ["$scope", "$stateParams", "$ionicModal", "Database", "$ionicListDelegate", "Menu", "$cordovaCamera", "Restaurant", "Upload", "$ionicLoading",
  function($scope, $stateParams, $ionicModal, Database, $ionicListDelegate, Menu, $cordovaCamera, Restaurant, Upload, $ionicLoading) {

    $scope.restoId = $stateParams.restaurantId;

    $scope.restaurant = Restaurant.get($stateParams.restaurantId);

    Restaurant.getMenus($scope.restoId).$loaded()
      .then((menus) => {
        $scope.restaurantMenus = menus;

        if (menus.length !== 0) {
          $ionicLoading.show();
        }

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
      })

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
      try{
        Restaurant.addCategory(category)
          .then(function() {
            console.log('ADDED CATEGORY!! ')
          })
        $scope.category.name = "";
        $scope.category.restaurant_id = "";
        $scope.addCategoryModal.hide();
      }
      catch(e){
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
      try{
        Menu.create({
          name : menu.name.toLowerCase(),
          price : menu.price,
          restaurant_id : $scope.restoId,
          category_id : menu.category,
          availability : false,
          prevPrice : menu.price,
          photoURL : $scope.photoURL,
          timestamp : firebase.database.ServerValue.TIMESTAMP
        })
          .then(() => {
            alert('Success');
            $scope.addMenuModal.hide();
          })
          .catch((err) => {
            alert(err);
          })
      }catch(e){
        $scope.submitError =true;
      }
    }

    $scope.deleteMenu = function(menu) {
      $ionicLoading.show();
      return Menu.delete(menu.$id)
        .then(() => {
          $ionicLoading.hide()
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
