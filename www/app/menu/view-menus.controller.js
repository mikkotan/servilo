app.controller("ViewMenusCtrl", ["$scope", "$stateParams", "restaurantMenu", "$ionicModal", "Database", "$ionicListDelegate", "Menu", "$cordovaCamera", "Restaurant", "Upload", "$ionicLoading",
  function($scope, $stateParams, restaurantMenu, $ionicModal, Database, $ionicListDelegate, Menu, $cordovaCamera, Restaurant, Upload, $ionicLoading) {

    if (restaurantMenu.length != 0) {
      $ionicLoading.show();
    }
    $scope.restaurantMenus = restaurantMenu;
    // $scope.categories = Menu.getMenuCategories(restaurantId);
    $scope.restoId = $stateParams.restaurantId;

    $scope.restaurant = Restaurant.get($stateParams.restaurantId);
    $scope.categories = Menu.getMenuCategories($stateParams.restaurantId);
    $scope.defaultCategory = $scope.categories[0];
    $scope.photoURL = "";

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
          console.log($scope.photoURL);
          $scope.$apply();
        });

      }, function(error) {
        console.error(error);
      });
    };
    $scope.openAddModal = function() {
      $scope.addMenuModal.show();
    }
    // $scope.addMenu = function(menu) {
    //   var categoryId = menu.category;
    //   var newKey = Menu.generateKey();
    //   Menu.menusRef(newKey).set({
    //       name: menu.name.toLowerCase(),
    //       price: menu.price,
    //       restaurant_id: $scope.restoId,
    //       category_id: categoryId,
    //       availability: false,
    //       prevPrice: menu.price,
    //       photoURL: $scope.photoURL,
    //       timestamp: firebase.database.ServerValue.TIMESTAMP
    //     })
    //     .then(function() {
    //       $scope.closeAddMenu();
    //       Menu.getRestaurantRef(restaurantId, categoryId, newKey);
    //     })
    // }

    $scope.addMenu = function(menu) {
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
    }

    // $scope.deleteMenu = function(menu) {
    //   console.log('Delete called');
    //   $scope.restaurantMenus.$remove(menu)
    //     .then((ref) => {
    //       Database.restaurantsReference().child(menu.restaurant_id).child('menus').child(menu.$id).set(null);
    //       Database.restaurantsReference().child(menu.restaurant_id).child('menu_categories').child(menu.category_id).child('menus').child(menu.$id).set(null);
    //     })
    // }

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
