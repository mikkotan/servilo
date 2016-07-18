app.controller("SignUpCtrl" , ["$scope" , "Auth" , "$firebaseArray" ,function($scope, Auth , $firebaseArray){

  var ref = firebase.database().ref().child("users");
  $scope.appUser = $firebaseArray(ref);

  $scope.createUser = function(user){
    Auth.$createUserWithEmailAndPassword(user.email , user.password)
      .then(function(firebaseUser){
        $scope.message = "User created with uid: " + firebaseUser.uid;
        $scope.appUser.$add({
          uid : firebaseUser.uid,
          fisrtName : user.firstName,
          lastName : user.lastName
        })
      }).catch(function(err){
        console.log("may error")
    });
  }
}]);
