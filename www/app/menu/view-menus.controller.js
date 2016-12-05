app.controller("ViewMenusCtrl", ["$scope", "$stateParams", "restaurantMenu", "$ionicModal", "Database", "$ionicListDelegate", "Menu", "$cordovaCamera", "Restaurant", "Upload",
  function($scope, $stateParams, restaurantMenu, $ionicModal, Database, $ionicListDelegate, Menu, $cordovaCamera, Restaurant, Upload) {

    $scope.restaurantMenus = restaurantMenu;
    // $scope.categories = Menu.getMenuCategories(restaurantId);
    $scope.restoId = $stateParams.restaurantId;

    $scope.restaurant = Restaurant.get($stateParams.restaurantId);
    $scope.categories = Menu.getMenuCategories($stateParams.restaurantId);
    $scope.defaultCategory = $scope.categories[0];
    $scope.photoURL = "";


    $scope.upload = function(index) {
      //disable save button
      var source = Upload.getSource(index);
      var options = Upload.getOptions(source);
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var menuRef = Upload.menu(imageData);
        $scope.progress = 1;
        menuRef.on('state_changed', function(snapshot) {
          $scope.progress = Upload.getProgress(snapshot);
          console.log('Upload is ' + $scope.progress + '% done');
        }, function(error) {
          console.log("error in uploading." + error);
        }, function() {
          //enable save button
          $scope.photoURL = menuRef.snapshot.downloadURL;
          $scope.$apply();
        });

      }, function(error) {
        console.error(error);
      });
    };
    $scope.openAddModal = function() {
      $scope.addMenuModal.show();
    }
    $scope.addMenu = function(menu) {
      var categoryId = menu.category;
      var newKey = Menu.generateKey();
      Menu.menusRef(newKey).set({
          name: menu.name.toLowerCase(),
          price: menu.price,
          restaurant_id: $scope.restoId,
          category_id: categoryId,
          availability: false,
          prevPrice: menu.price,
          photoURL: $scope.photoURL,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        .then(function() {
          $scope.closeAddMenu();
          Menu.getRestaurantRef(restaurantId, categoryId, newKey);
        })
    }

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

    $scope.closeAddMenu = function() {
      $scope.addMenuModal.hide();
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

    $ionicModal.fromTemplateUrl('app/menu/_add-menu.html', function(addMenuModal) {
      $scope.addMenuModal = addMenuModal;
    }, {
      scope: $scope
    });


  }
]);
