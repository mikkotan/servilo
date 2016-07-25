app.controller("LoginCtrl",["$scope" , "$firebaseArray", "$firebaseAuth", "Auth",
function($scope , $firebaseArray , $firebaseAuth , Auth ){

$scope.auth = Auth;

  $scope.login = function(user){
    console.log(user.password);
      Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebase){
          console.log("----------------------------")
          console.log(firebase.uid);
          user.password = "";
          user.email = ""
        }).catch(function(err){
          console.log("sala password")
        });
  };

  Auth.$onAuthStateChanged(function(firebaseUser){
    console.log($scope.authUser);
    $scope.firebaseUser = firebaseUser;
    var userId = firebaseUser.uid
    firebase.database().ref('/users/'+userId).once('value').then(function(user){
      $scope.authUser = user.val()
      console.log($scope.authUser);
    });

   })

// firebase.database().ref('users').then(function(users){
//   console.log(users);
// });
//
//


}]);
