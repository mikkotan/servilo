app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "$firebaseObject", "Auth","AppUser",
function($scope , $firebaseArray , $firebaseAuth, $firebaseObject, Auth , AppUser){

$scope.auth = Auth;

  $scope.login = function(user){
    console.log(user.password);
      Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebase){
          console.log("----------------------------")
          console.log(firebase.uid);
          user.password = " ";
          user.email = ""
        }).catch(function(err){
          console.log("sala password")
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




}]);
