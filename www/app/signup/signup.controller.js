app.controller("SignUpCtrl" , ["$scope", "Auth", "$firebaseArray", "$firebaseObject", "User", "$state", "IonicPushService",
  function($scope, Auth, $firebaseArray, $firebaseObject, User, $state, IonicPushService) {

  $scope.createUser = function(user) {
    Auth.$createUserWithEmailAndPassword(user.email , user.password)
      .then(function(firebaseUser) {
        var ref = firebase.database().ref().child("users").child(firebaseUser.uid);
        $scope.appUser = $firebaseArray(ref);
        $scope.message = "User created with uid: " + firebaseUser.uid;
        console.log($scope.message);
        ref.set({
          firstName : user.firstName,
          lastName : user.lastName,
          displayName : user.firstName + " " + user.lastName,
          description: "",
          provider: "email",
          startedAt : firebase.database.ServerValue.TIMESTAMP
        },function(error) {
          if(error) {
            console.log("hello error" + error);
          }
          else {
            console.log("no error means succues");
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              IonicPushService.registerToAuth();
            }
          }
        })
        console.log("done")
        $state.go("tabs.home");
      }).catch(function(err){
        console.log(err);
        console.log("may error")
    });
  }
}]);
