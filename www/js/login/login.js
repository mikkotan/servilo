app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "$firebaseObject", "Auth", "AppUser", "ionicMaterialInk", "ionicMaterialMotion","User", "$state",
function($scope , $firebaseArray , $firebaseAuth, $firebaseObject, Auth , AppUser, ionicMaterialInk, ionicMaterialMotion,User,$state){

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

  Auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
      $scope.firebaseUser = User.authFullName();
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
