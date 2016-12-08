app.controller("SignUpCtrl" , ["$scope", "Auth","User", "$state", "IonicPushService","Database",
  function($scope, Auth, User, $state, IonicPushService,Database) {

  $scope.createUser = function(user) {
    Auth.$createUserWithEmailAndPassword(user.email , user.password)
      .then(function(firebaseUser) {

        var ref = Database.usersReference().child(firebaseUser.uid);
        $scope.appUser = Database.firebaseArray(ref);



        $scope.message = "User created with uid: " + firebaseUser.uid;

        ref.set({
          firstName : user.firstName,
          lastName : user.lastName,
          displayName : user.firstName + " " + user.lastName,
          description : "",
          provider : "email",
          startedAt : firebase.database.ServerValue.TIMESTAMP
        },function(error) {
          if(error) {
            console.log("hello error" + error);
          }
          else {
            console.log("no error means succues");
            User.setAsUser(firebaseUser.uid);
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              IonicPushService.registerToAuth();
            }
          }
        })
        $state.go("tabs.home");
      }).catch(function(err){
        console.log(err);
        console.log("may error")
    });
  }
}]);
