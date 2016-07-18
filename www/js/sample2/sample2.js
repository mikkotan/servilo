app.controller('HomeTabCtrl', ["$scope","$ionicModal","$firebaseArray","currentAuth",
function($scope, $ionicModal, $firebaseArray , currentAuth) {
  console.log('HomeTabCtrl');

  var ref = firebase.database().ref().child("messages");
  $scope.messages = $firebaseArray(ref);
}]);
