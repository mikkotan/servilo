app.controller("UsersCtrl" , ["$scope" , "Auth" , "$firebaseArray", "$firebaseAuth",
  function($scope , Auth , $firebaseArray, $firebaseAuth){

console.log("wew");

var ref = firebase.database().ref().child("users");
$scope.user = $firebaseArray(ref);
console.log($scope.user[0]);


}]);
