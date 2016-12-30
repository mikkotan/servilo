app.controller("ProfileCtrl", ["$scope", "User", "$ionicLoading", "$ionicPopover", "$ionicModal", "Database", "$cordovaCamera", "Upload", "Auth", "Restaurant", "ionicMaterialMotion", "ionicMaterialInk", "$timeout",
  function($scope, User, $ionicLoading, $ionicPopover, $ionicModal, Database, $cordovaCamera, Upload, Auth, Restaurant, ionicMaterialMotion, ionicMaterialInk, $timeout) {

    // Set Motion
    $timeout(function() {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);

    // $timeout(function() {
    //   ionicMaterialMotion.fadeSlideInRight({
    //     startVelocity: 3000
    //   });
    // }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

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

    User.getAuthFavorites().$loaded()
      .then((favs) => {
        $scope.usrFavs = favs;
        if(favs.length == 0) {
          $ionicLoading.hide();
        }
        $scope.$watchCollection('usrFavs', function(favorites) {
          $scope.userFavorites = favorites.map(function(restaurant) {
            var r = {
              restaurant: restaurant,
              get: function() {
                Restaurant.get(restaurant.$id).$loaded()
                  .then((res) => {
                    r.name = res.name
                    r.ready = true
                    r.details = res
                    // ionicMaterialMotion.slideUp({
                    //   selector: '.slide-up'
                    // });
                    ionicMaterialMotion.fadeSlideInRight({
                      startVelocity: 3000
                    });
                  })
              }()
            }
            return r;
          })
        })
      })



    $scope.remove = function(restaurant) {
      console.log(JSON.stringify(restaurant, null, 4));
      console.log(restaurant.name);
      console.log(restaurant.restaurant.$id);
      User.removeFromFavorites(restaurant);
    }

    Auth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
        // $scope.firebaseUser = User.auth();
        User.auth().$loaded().then(function(data) {
            $scope.firebaseUser = data;
            if (data.photoURL) {
              $scope.photoURL = data.photoURL;
            }
          })
          // if(firebaseUser.displayName) {
          //   //it means all social logins
          // }
      }
    });

    $scope.openEditProfile = function() {
      $scope.currentUser = User.auth();
      //   $scope.currentUser = User.auth();
      $scope.editProfileModal.show();
      $scope.closePopover();
    };
    $scope.openEditPhoto = function() {
      $scope.editPhotoModal.show();
      $scope.closePopover();
    }
    $scope.closeEditPhoto = function() {
      // $scope.photoURL = null;
      // $scope.progress = null;
      $scope.editPhotoModal.hide();
    }
    $scope.openPopover = function($event, user) {
      $scope.photoURL = user.photoURL;
      $scope.optionsPopover.show($event);
    };
    $scope.closePopover = function() {
      $scope.optionsPopover.hide();
    };

    $scope.upload = function(index) {
      navigator.camera.getPicture(function(imageData) {
        Upload.profile(imageData).then(function(downloadURL) {
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

    $scope.editProfile = function(user) {
      $scope.optionsPopover.hide();

      var userRef = Database.usersReference().child(User.auth().$id);
      userRef.update({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        description: user.description
      })

      $scope.editProfileModal.hide();
    }

    $scope.editPhoto = function() {
      $scope.optionsPopover.hide();
      var userRef = Database.usersReference().child(User.auth().$id);
      userRef.update({
        photoURL: $scope.photoURL
      })
      // $scope.progress = null;
      $scope.editPhotoModal.hide();
    }


  }
]);
