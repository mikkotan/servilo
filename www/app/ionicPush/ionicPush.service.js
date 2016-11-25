app.factory('IonicPushService', function($ionicPush, User, Database, $cordovaPushV5) {

  var IonicPushService = {
    registerDevice : function() {
      $ionicPush.register()
        .then((t) => {
          $ionicPush.saveToken(t)
        })
        .then((t) => {
          console.log("Token saved: " + t.token)
        })
    },
    getToken : function() {
      return $ionicPush.token.token
    },
    registerToAuth : function() {
      console.log("registering this token: "+localStorage.myPush);
      var tempToken = localStorage.myPush;
      var token = tempToken.split(':');

      var currentAuthRef = Database.usersReference().child(User.auth().$id).child('device_token').child(token[0]);
      currentAuthRef.set(token[1]);
    }
  }

  return IonicPushService;
})
