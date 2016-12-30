app.controller("AddMenuCtrl",["$scope", "restaurantId", "$cordovaCamera", "Restaurant", "Menu", "Upload", "$state",
  function($scope, restaurantId, $cordovaCamera, Restaurant, Menu, Upload, $state){

    $scope.restaurant = Restaurant.get(restaurantId);
    $scope.categories = Menu.getMenuCategories(restaurantId);
    $scope.defaultCategory = $scope.categories[0];
    $scope.photoURL = "";

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
      Menu.create({
        name : menu.name.toLowerCase(),
        price : menu.price,
        restaurant_id : restaurantId,
        category_id : menu.category,
        availability : false,
        prevPrice : menu.price,
        photoURL : $scope.photoURL,
        timestamp : firebase.database.ServerValue.TIMESTAMP
      })
        .then(() => {
          $state.go('tabs.restaurant');
          alert('Success');
        })
        .catch((err) => {
          alert(err);
        })
    }

}]);
