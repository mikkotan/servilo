app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "$firebaseObject", "Auth", "AppUser", "ionicMaterialInk", "ionicMaterialMotion","User",
function($scope , $firebaseArray , $firebaseAuth, $firebaseObject, Auth , AppUser, ionicMaterialInk, ionicMaterialMotion,User){

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
      $scope.firebaseUser = User.authFullName();
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
