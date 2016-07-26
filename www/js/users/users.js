app.controller("UsersCtrl" , ["$scope" , "Auth" , "$firebaseArray", "$firebaseAuth","User",
  function($scope , Auth , $firebaseArray, $firebaseAuth, User){

console.log("wew");

var ref = firebase.database().ref().child("users");
$scope.authUser = User.auth()
$scope.users = User.all();
console.log("wew"+$scope.user)



}]);
