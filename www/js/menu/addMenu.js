app.controller("AddMenuCtrl",["$scope","$stateParams","menus","$firebaseArray","$firebaseObject","$state","restaurantId","$cordovaCamera",
  function($scope ,$stateParams,menus,$firebaseArray,$firebaseObject,$state,restaurantId, $cordovaCamera){

    $scope.menus = menus;

    $scope.imageURL = "";

    $scope.upload = function(index) {
      var source = "";
      switch(index) {
        case 1:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 2:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      var options = {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : source,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imageURL = imageData;

        }, function(error) {
          console.error(error);
        });
    }

    $scope.addMenu = function(menu){
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : restaurantId,
      prevPrice : menu.price,
      image : $scope.imageURL,
      timestamp : firebase.database.ServerValue.TIMESTAMP
    }).then(function(menuObj){
      Database.restaurantsReference().child(restaurantId).child("menus").child(menuObj.key).set(true);
    })
    $state.go('tabs.restaurant');
  }

}]);
