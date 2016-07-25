app.controller("SignUpCtrl" , ["$scope" , "Auth" , "$firebaseArray" ,function($scope, Auth , $firebaseArray){


  $scope.createUser = function(user){
    Auth.$createUserWithEmailAndPassword(user.email , user.password)
      .then(function(firebaseUser){
        $scope.message = "User created with uid: " + firebaseUser.uid;
        saveUser(firebaseUser.uid, user.firstName , user.lastName);

      }).catch(function(err){
        console.log("may error");
    });
  }

  function saveUser(userId , userFirstName , userLastName){
    firebase.database().ref('users/' + userId).set({
      firstName: userFirstName,
      lastName : userLastName
    })
  }

}]);
