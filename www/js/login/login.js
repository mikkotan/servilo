app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "$firebaseObject", "Auth", "AppUser", "ionicMaterialInk", "ionicMaterialMotion", "User", "$state", "$cordovaOauth",
function($scope , $firebaseArray , $firebaseAuth, $firebaseObject, Auth, AppUser, ionicMaterialInk, ionicMaterialMotion, User, $state, $cordovaOauth){

  ionicMaterialInk.displayEffect();

  $scope.auth = Auth;
  $scope.login = function(user){
    alert("button clicked");
    console.log(user.password);
    Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebase){
      alert("success");
      console.log("----------------------------")
      console.log(firebase.uid);
      user.password = "";
      user.email = ""
      $state.go("tabs.home")
    }).catch(function(err){
      console.log(err)
      alert("error");
    });
  };
  $scope.fbLogin = function() {
    // var provider = new firebase.auth.FacebookAuthProvider();
    // firebase.auth().signInWithPopup(provider).then(function(result) {
    //   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //   var token = result.credential.accessToken;
    //   // The signed-in user info.
    //   var user = result.user;
    //   // ...
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });
  $cordovaOauth.facebook("1697524080497035", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result){
    $scope.detailsfb = result.access_token;
    Auth.$signInWithCredential(firebase.auth.FacebookAuthProvider.credential(result.access_token)).then(
      function(succes){
        console.log(succes.displayName);
        console.log('Firebase Facebook login success');
      },
      function(error){
        console.log("error!!");
        console.log(error);
      });
    }, function(error){
        console.log("errrr!!");
        alert("Error: " + error);
    });
  }

  Auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
      if(firebaseUser.providerData[0].providerId == "facebook.com") {
        console.log("facebook provider");
        $scope.firebaseUser = firebaseUser.displayName;
        $scope.photoURL = firebaseUser.providerData[0].photoURL;
        // console.log($scope.photoURL)
      }
      else { //providerId == password
        console.log("email provider");
        // var user = User.auth();
        $scope.firebaseUser = User.auth();
      }
    }
  })

  $scope.signOut = function() {
    Auth.$signOut();
    console.log("logged out..");
    location.reload();
  }
// firebase.database().ref('users').then(function(users){
//   console.log(users);
// });
}]);
