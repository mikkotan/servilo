app.controller("UsersCtrl" , ["$scope" , "Auth" , "$firebaseArray", "$firebaseAuth","User",
  function($scope , Auth , $firebaseArray, $firebaseAuth, User){

$scope.authUser = User.auth();
$scope.users = User.all();
console.log("wew"+$scope.user)
}]);
