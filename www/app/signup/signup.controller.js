app.controller("SignUpCtrl", ["$scope", "Auth", "User", "$state", "IonicPushService", "Database", "$ionicSideMenuDelegate",
  function($scope, Auth, User, $state, IonicPushService, Database, $ionicSideMenuDelegate) {
    
    $scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function() {
      $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.createUser = function(user) {
      Auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(firebaseUser) {

          var ref = Database.usersReference().child(firebaseUser.uid);
          $scope.appUser = Database.firebaseArray(ref);

          User.setAsUser(firebaseUser.uid);

          $scope.message = "User created with uid: " + firebaseUser.uid;

          ref.set({
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.firstName + " " + user.lastName,
            description: "",
            provider: "email",
            startedAt: firebase.database.ServerValue.TIMESTAMP
          }, function(error) {
            if (error) {
              console.log("hello error" + error);
            } else {
              console.log("no error means succues");
              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                IonicPushService.registerToAuth();
              }
            }
          })
          $state.go("tabs.home");
        }).catch(function(err) {
          console.log(err);
          console.log("may error")
        });
    }
  }
]);
