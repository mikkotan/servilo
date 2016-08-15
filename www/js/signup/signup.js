app.controller("SignUpCtrl" , ["$scope" , "Auth" , "$firebaseArray", "$firebaseObject","User",
  function($scope, Auth , $firebaseArray, $firebaseObject , User){

  $scope.createUser = function(user){
    Auth.$createUserWithEmailAndPassword(user.email , user.password)
      .then(function(firebaseUser){
        var ref = firebase.database().ref().child("users").child(firebaseUser.uid);
        $scope.appUser = $firebaseArray(ref);
        $scope.message = "User created with uid: " + firebaseUser.uid;
        ref.set({
          firstName : user.firstName,
          lastName : user.lastName,
          startedAt : firebase.database.ServerValue.TIMESTAMP
        })
        User.setOnline();
        console.log("done")
      }).catch(function(err){
        console.log(err);
        console.log("may error")
    });
  }

  // function saveUser(userId , userFirstName , userLastName){
  //   firebase.database().ref('users/' + userId).set({
  //     firstName: userFirstName,
  //     lastName : userLastName
  //   })
  // }

}]);
