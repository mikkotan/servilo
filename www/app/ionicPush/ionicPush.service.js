app.factory('IonicPushService', function($ionicPush, User, Database) {
  console.log('ionic push service');

  var IonicPushService = {
    registerDevice : function() {
      console.log('Registering token to device');
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
      console.log('Registering token to currentAuth');
      var tempToken = $ionicPush.token.token;
      console.log('Current Device Token : ' +tempToken);
      var token = tempToken.split(':');

      var currentAuthRef = Database.usersReference().child(User.auth().$id).child('device_token').child(token[0]);
      currentAuthRef.set(token[1]);
    }
  }

  return IonicPushService;
})
