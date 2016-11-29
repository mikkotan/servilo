app.controller("AddMenuCtrl",["$scope", "$stateParams", "menus", "$firebaseArray","$state", "restaurantId", "$cordovaCamera", "Database", "Restaurant", "Upload",
  function($scope, $stateParams, menus, $firebaseArray, $state, restaurantId, $cordovaCamera, Database, Restaurant, Upload){

    $scope.menus = menus;
    $scope.restaurant = Restaurant.get(restaurantId);
    $scope.categories = $firebaseArray(Database.restaurantsReference().child(restaurantId).child('menu_categories'));

    $scope.upload = function(index) {
      //disable save button
      var source = Upload.getSource(index);
      var options = Upload.getOptions(source);
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var menuRef = Upload.menu(imageData);
        $scope.progress = 1;
        menuRef.on('state_changed', function(snapshot){
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
    }

    $scope.addMenu = function(menu) {
      var categoryId = menu.category;
      $scope.menus.$add({
        name : menu.name.toLowerCase(),
        price : menu.price,
        restaurant_id : restaurantId,
        category_id : categoryId,
        availability : false,
        prevPrice : menu.price,
        photoURL : $scope.photoURL,
        timestamp : firebase.database.ServerValue.TIMESTAMP
      })
      .then(function(menuObj) {
        var restaurantRef = Database.restaurantsReference().child(restaurantId);
        restaurantRef.child('menus').child(menuObj.key).set(true);
        restaurantRef.child('menu_categories').child(categoryId).child('menus').child(menuObj.key).set(true);
      })
      $state.go('tabs.restaurant');
  }

}]);
