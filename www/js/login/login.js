app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "$firebaseObject", "Auth", "AppUser", "ionicMaterialInk", "ionicMaterialMotion",
function($scope , $firebaseArray , $firebaseAuth, $firebaseObject, Auth , AppUser, ionicMaterialInk, ionicMaterialMotion){

ionicMaterialInk.displayEffect();
$scope.auth = Auth;
  $scope.login = function(user){
    console.log(user.password);
      Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebase){
          console.log("----------------------------")
          console.log(firebase.uid);
          user.password = "";
          user.email = ""
        }).catch(function(err){
          console.log(err)
        });
  };

  Auth.$onAuthStateChanged(function(firebaseUser){
    var ref = firebase.database().ref().child("users");
    if(firebaseUser){
      var firebaseAuthUser = $firebaseObject(ref.child(firebaseUser.uid));
      console.log(firebaseAuthUser);
      $scope.firebaseUser = firebaseAuthUser;
    }
    // $scope.authUser = $firebaseArray(ref);
    //

   })
  $scope.signOut = function() {
    Auth.$signOut();
    console.log("logged out..");
    location.reload();
  }
// firebase.database().ref('users').then(function(users){
//   console.log(users);
// });
//
//


}]);
