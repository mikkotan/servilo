// app.controller('ProfileCtrl', ['$scope', 'User', 'Database', '$cordovaCamera', '$ionicModal',
//   function($scope, User, Database, $cordovaCamera, $ionicModal) {
//
//     $scope.upload = function(index) {
//       var source = "";
//       switch(index) {
//         case 1:
//           source = Camera.PictureSourceType.CAMERA;
//           break;
//         case 2:
//           source = Camera.PictureSourceType.PHOTOLIBRARY;
//           break;
//       }
//       var options = {
//         quality : 75,
//         destinationType : Camera.DestinationType.DATA_URL,
//         sourceType : source,
//         allowEdit : true,
//         encodingType: Camera.EncodingType.JPEG,
//         popoverOptions: CameraPopoverOptions,
//         targetWidth: 500,
//         targetHeight: 500,
//         saveToPhotoAlbum: false
//       };
//       $cordovaCamera.getPicture(options).then(function(imageData) {
//         $scope.imageURL = imageData;
//
//         }, function(error) {
//           console.error(error);
//         });
//     }
//
//     $scope.editProfile = function(user) {
//       var userRef = Database.usersReference().child(User.auth().$id);
//       userRef.set({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         displayName: user.displayName,
//         description: user.description
//         // image: $scope.imageURL
//       })
//     }
//
//     $ionicModal.fromTemplateUrl('app/profile/_edit-profile.html', function(editProfileModal) {
//       $scope.editProfileModal = editProfileModal;
//     }, {
//       scope: $scope
//     });
//
//
//   }])

app.controller("ProfileCtrl", ["$scope", "User", "$ionicLoading", "$ionicPopover", "$ionicModal", "Database", "$cordovaCamera",
  function($scope, User, $ionicLoading, $ionicPopover, $ionicModal, Database, $cordovaCamera) {

    $ionicPopover.fromTemplateUrl('app/profile/_popover.html', {
      scope: $scope
    }).then(function(optionsPopover) {
      $scope.optionsPopover = optionsPopover;
    });

    $ionicModal.fromTemplateUrl('app/profile/_edit-profile.html', function(editProfileModal) {
      $scope.editProfileModal = editProfileModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/profile/_edit-photo.html', function(editPhotoModal) {
      $scope.editPhotoModal = editPhotoModal;
    }, {
      scope: $scope
    });

    $scope.openEditProfile = function() {
      $scope.editProfileModal.show();
      $scope.closePopover();
    };
    $scope.openEditPhoto = function() {
      $scope.editPhotoModal.show();
      $scope.closePopover();
    }

    $scope.openPopover = function($event) {
      $scope.optionsPopover.show($event);
    };
    $scope.closePopover = function() {
      $scope.optionsPopover.hide();
    };

    $scope.upload = function(index) {
      var source = "";
      switch (index) {
        case 1:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 2:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: source,
        allowEdit: true,
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

    // $scope.editProfile = function(user) {
    //   $scope.optionsPopover.hide();
    //   var userRef = Database.usersReference().child(User.auth().$id);
    //   console.log(user.firstName)
    //   console.log(user.lastName)
    //   console.log(user.descriptionName)
    //   userRef.set({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     displayName: user.displayName,
    //     description: user.description,
    //     // image: $scope.imageURL
    //   })
    //   $scope.editProfileModal.hide();
    // }

    $scope.editProfile = function(user) {
      $scope.optionsPopover.hide();

      var userRef = Database.usersReference().child(User.auth().$id);
      userRef.set({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        description: user.description
        // image: $scope.imageURL
      })

      $scope.editProfileModal.hide();
    }

    $scope.editPhoto = function(user) {
      $scope.optionsPopover.hide();
      var userRef = Database.usersReference().child(User.auth().$id);
      userRef.update({
        image: $scope.imageURL
      })
      $scope.editPhotoModal.hide();
    }


  }
]);
