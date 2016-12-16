app.controller("LoginCtrl", ["$scope", "Auth", "ionicMaterialInk", "$ionicSideMenuDelegate", "ionicMaterialMotion", "User", "$state", "$ionicLoading", "$ionicModal", "Database", "IonicPushService", "$ionicPopup", "$timeout",
  function($scope, Auth, ionicMaterialInk, $ionicSideMenuDelegate, ionicMaterialMotion, User, $state, $ionicLoading, $ionicModal, Database, IonicPushService, $ionicPopup, $timeout) {
    $scope.passwordType= "password";
    ionicMaterialInk.displayEffect();
    $timeout(function() {
      ionicMaterialMotion.blinds({
        startVelocity: 3000
      });
    }, 500);

    $scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function() {
      $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.googleLogin = function() {
      window.plugins.googleplus.login({
          // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          // 'webClientId': 'client id of the web app/server side', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'webClientId': '155324175920-s00ut5rm6o0jjv7bhltb7l88tgevcjlt.apps.googleusercontent.com'
            // 'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function(result) {
          console.log('result');
          // alert(JSON.stringify(obj)); // do something useful instead of alerting
          Auth.$signInWithCredential(firebase.auth.GoogleAuthProvider.credential(result.idToken)).then(
            function(success) {
              console.log("google login success");
              var ref = firebase.database().ref().child("users").child(success.uid);
              ref.once('value', function(snapshot) {
                var googleUser = snapshot.val();
                if (googleUser === null) {
                  ref.set({
                    displayName: success.displayName,
                    provider: "google",
                    firstName: "",
                    lastName: "",
                    description: "",
                    startedAt: firebase.database.ServerValue.TIMESTAMP
                  })
                }
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  IonicPushService.registerToAuth();
                }
                console.log('Firebase Google login success');
                $state.go("tabs.home");
              })
            },
            function(error) {
              console.log("google login error");
              alert('error' + error);
            })
        },
        function(msg) {
          // alert('error: ' + msg);
        }
      );
    }

    $scope.disconnect = function() {
      window.plugins.googleplus.disconnect(
        function(msg) {
          alert(msg); // do something useful instead of alerting
        }
      );
    }

    $scope.glogout = function() {
      window.plugins.googleplus.logout(
        function(msg) {
          alert(msg); // do something useful instead of alerting
        }
      );
    }

    $scope.twitterLogin = function() {
      TwitterConnect.login(
        function(result) {
          Auth.$signInWithCredential(firebase.auth.TwitterAuthProvider.credential(result.token, result.secret)).then(
            function(success) {
              var ref = firebase.database().ref().child("users").child(success.uid);
              ref.once('value', function(snapshot) {
                var twitterUser = snapshot.val()
                if (twitterUser === null) {
                  ref.set({
                    displayName: success.displayName,
                    provider: "twitter",
                    firstName: "",
                    lastName: "",
                    description: "",
                    startedAt: firebase.database.ServerValue.TIMESTAMP
                  })
                }
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  IonicPushService.registerToAuth();
                }
                console.log('Firebase Twitter login success');
                $state.go("tabs.home");
              })
            },
            function(error) {
              console.log('error firebase login!!: ' + error);
            })
        },
        function(error) {
          // console.log('Error logging in: ' + error);
        }
      );
    }
    $scope.auth = Auth;
    $scope.login = function(user) {
      $ionicLoading.show({
        template: '<p>Logging in . . .</p><ion-spinner></ion-spinner>',
        duration: 2000
      });
      Auth.$signInWithEmailAndPassword(user.email, user.password)
        .then(function(authUser) {
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            console.log("android or ios platform");
            IonicPushService.registerToAuth();
          }
          $ionicLoading.hide();

          $state.go("tabs.home")
          user.password = "";
          user.email = "";
        })
        .catch(function(err) {
          $ionicLoading.hide();
          $ionicPopup.alert({
              title: 'Authentication Failed',
              template: 'Incorrect username or password.'
            })
            .then((res) => {
              user.password = '';
              console.log('tapped ' + res);
            })
          console.log(JSON.stringify(err, null, 4));
        });
    };
    $scope.fbLogin = function() {
      facebookConnectPlugin.login(["public_profile", "user_birthday"],
        function(result) {
          Auth.$signInWithCredential(firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken)).then(
            function(success) {
              var ref = firebase.database().ref().child("users").child(success.uid);
              ref.once('value', function(snapshot) {
                var fbUser = snapshot.val();
                if (fbUser === null) {
                  ref.set({
                    displayName: success.displayName,
                    provider: "facebook",
                    firstName: "",
                    lastName: "",
                    description: "",
                    startedAt: firebase.database.ServerValue.TIMESTAMP
                  })
                }

                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  IonicPushService.registerToAuth();
                }
                console.log('Firebase Facebook login success');
                $ionicLoading.hide();
                $state.go("tabs.home")
              })
            },
            function(error) {
              $ionicLoading.hide();
              console.log('error!!: ' + error);
            });
        },
        function(error) {
          console.log("ERROR FB CONNECT");
          console.log(error);
        })
    }

    $scope.closeChangePassword = function() {
      $scope.changePassword.hide();
    }

    $scope.changePasswordShow = function() {
      $scope.changePassword.show();
    }

    $scope.updateNewPassword = function(firebaseUser) {
      var user = firebase.auth().currentUser;
      var email = user.email;
      var password = firebaseUser.oldPassword;
      var credential = firebase.auth.EmailAuthProvider.credential(email, password);

      user.reauthenticate(credential).then(function() {
        $ionicLoading.show();
        user.updatePassword(firebaseUser.newPassword).then(function() {
          $ionicLoading.hide();
          $scope.changePassword.hide();
        }, function() {
          console.log("update password error")
        })
      }, function() {
        console.log("reauth failed");
      })
    }

    $ionicModal.fromTemplateUrl('templates/change-password.html', function(modalChangePassword) {
      $scope.changePassword = modalChangePassword;
    }, {
      scope: $scope
    });

    $scope.showHidePassword = function(){
      if ($scope.passwordType == 'password'){
        $scope.passwordType= 'text';
      }else{
          $scope.passwordType = 'password';
      }
    }
  }
]);
