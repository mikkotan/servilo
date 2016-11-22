app.controller('ProfileCtrl', ['$scope', 'User', 'Database', '$cordovaCamera', '$ionicModal',
  function($scope, User, Database, $cordovaCamera, $ionicModal) {

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

    $scope.editProfile = function(user) {
      var userRef = Database.usersReference().child(User.auth().$id);
      userRef.update({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        description: user.description
        // image: $scope.imageURL
      })
    }

    $ionicModal.fromTemplateUrl('app/profile/_edit-profile.html', function(editProfileModal) {
      $scope.editProfileModal = editProfileModal;
    }, {
      scope: $scope
    });


  }])
