app.controller("LoginCtrl",["$scope", "Auth", "ionicMaterialInk", "ionicMaterialMotion", "User", "$state", "$cordovaOauth", "$ionicLoading", "$ionicModal", "Database",
    function($scope, Auth, ionicMaterialInk, ionicMaterialMotion, User, $state, $cordovaOauth, $ionicLoading, $ionicModal, Database){

  ionicMaterialInk.displayEffect();

  $scope.googleLogin = function() {
    window.plugins.googleplus.login(
      {
        // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        // 'webClientId': 'client id of the web app/server side', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'webClientId': '155324175920-s00ut5rm6o0jjv7bhltb7l88tgevcjlt.apps.googleusercontent.com'
        // 'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      },
      function (result) {
        // alert(JSON.stringify(obj)); // do something useful instead of alerting
        Auth.$signInWithCredential(firebase.auth.GoogleAuthProvider.credential(result.idToken)).then(
        function(success){
          var ref = firebase.database().ref().child("users").child(success.uid);
          ref.set({
            displayName : success.displayName,
            provider: "google",
            startedAt : firebase.database.ServerValue.TIMESTAMP
          })
          console.log('Firebase Google login success');
          $state.go("tabs.home");
        },
        function(error) {
          alert('error' + error);
        })
      },
      function (msg) {
        // alert('error: ' + msg);
      }
    );
  }

  $scope.disconnect = function() {
    window.plugins.googleplus.disconnect(
      function (msg) {
        alert(msg); // do something useful instead of alerting
      }
    );
  }

  $scope.glogout = function() {
    window.plugins.googleplus.logout(
      function (msg) {
        alert(msg); // do something useful instead of alerting
      }
    );
  }

  $scope.twitterLogin = function() {
    TwitterConnect.login(
      function(result) {
        Auth.$signInWithCredential(firebase.auth.TwitterAuthProvider.credential(result.token, result.secret)).then(
        function(success){
          var ref = firebase.database().ref().child("users").child(success.uid);
          ref.set({
            displayName : success.displayName,
            provider: "twitter",
            startedAt : firebase.database.ServerValue.TIMESTAMP
          })
          console.log(success.displayName);
          console.log('Firebase Twitter login success');
          $state.go("tabs.home");
        },
        function(error){
          console.log('error firebase login!!: ' + error);
        })
      }, function(error) {
        // console.log('Error logging in: ' + error);
      }
    );
  }

  $scope.auth = Auth;

  $scope.login = function(user){
    // console.log(user.password);
    $ionicLoading.show();
    Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(authUser){
      $state.go("tabs.home")
      $ionicLoading.hide();
      user.password = "";
      user.email = "";
    }).catch(function(err){
      $ionicLoading.hide();
      console.log(err);
    });
  };
  $scope.fbLogin = function() {
    // $cordovaOauth.facebook("1697524080497035", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"})
    // .then(function(result){
    //   $ionicLoading.show();
    //   Auth.$signInWithCredential(firebase.auth.FacebookAuthProvider.credential(result.access_token)).then(
    //     function(succes){
    //       var ref = firebase.database().ref().child("users").child(succes.uid);
    //       ref.set({
    //         displayName : succes.displayName,
    //         provider: "facebook",
    //         startedAt : firebase.database.ServerValue.TIMESTAMP
    //       },function(error) {
    //         $ionicLoading.hide();
    //         console.log("hello error" + error);
    //       })
    //       console.log(succes.displayName);
    //       console.log('Firebase Facebook login success');
    //       $ionicLoading.hide();
    //       $state.go("tabs.home")
    //     },
    //     function(error){
    //       $ionicLoading.hide();
    //       console.log('error!!: ' + error);
    //     });
    //   }, function(error){
    //       $ionicLoading.hide();
    //       console.log('errrr!!' + error);
    //   });

    facebookConnectPlugin.login(["public_profile", "user_birthday"], 
      function(result) {
        Auth.$signInWithCredential(firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken)).then(
        function(success){
          var ref = firebase.database().ref().child("users").child(success.uid);
          ref.set({
            displayName : success.displayName,
            provider: "facebook",
            startedAt : firebase.database.ServerValue.TIMESTAMP
          })
          console.log(success.displayName);
          console.log('Firebase Facebook login success');
          $ionicLoading.hide();
          $state.go("tabs.home")
        },
        function(error){
          $ionicLoading.hide();
          console.log('error!!: ' + error);
        });
    }, function(error) {
        console.log("ERROR FB CONNECT");
        console.log(error);
    })
  }

  Auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
      $scope.firebaseUser = firebaseUser.displayName;
      // if(firebaseUser.providerData[0].providerId == "facebook.com") {
      //   console.log("facebook provider");
      //   $scope.firebaseUser = firebaseUser.displayName;
      //   $scope.photoURL = firebaseUser.providerData[0].photoURL;
      // }
      // else { //providerId == password
      //   console.log("email provider");
      //   $scope.firebaseUser = User.auth();
      //   $scope.fullname = User.getAuthFullName();
      // }
    }
  })

  // $scope.signOut = function() {
  //   Auth.$signOut();

  //   console.log("logged out..");
  //   location.reload();
  // }

  $scope.editProfile = function() {
    $scope.editProfileModal.show();
  }

  $scope.updateProfile = function(firebaseUser) {
    var userRef = Database.usersReference().child(User.auth().$id);
    userRef.update({
      firstName: firebaseUser.firstName,
      lastName: firebaseUser.lastName
    })
    $scope.editProfileModal.hide();
  }

  $scope.closeEditProfile = function() {
    $scope.editProfileModal.hide();
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
    var credential = firebase.auth.EmailAuthProvider.credential(email,password);

    user.reauthenticate(credential).then(function(){
      $ionicLoading.show();
      user.updatePassword(firebaseUser.newPassword).then(function() {
        $ionicLoading.hide();
        $scope.changePassword.hide();
      },function() {
        console.log("update password error")
      })
    },function(){
      console.log("reauth failed");
    })
  }

  $ionicModal.fromTemplateUrl('templates/edit-profile.html', function(modalEditProfile) {
    $scope.editProfileModal = modalEditProfile;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/change-password.html', function(modalChangePassword) {
    $scope.changePassword = modalChangePassword;
  }, {
    scope: $scope
  });
}]);
