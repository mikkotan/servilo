app.factory('IonicPushService', function($ionicPush, User, Database, $cordovaPushV5) {

  var IonicPushService = {
    registerDevice: function() {
      localStorage.myPush = '';
      $cordovaPushV5.initialize({
          android: {
            senderID: "155324175920"
          },
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false',
            clearBadge: true
          },
          windows: {}
        })
        .then((result) => {
          $cordovaPushV5.onNotification();
          $cordovaPushV5.onError();
          $cordovaPushV5.register()
            .then((registerResult) => {
              console.log("Register Result: " + registerResult)
              localStorage.myPush = registerResult;
            })
            .catch((err) => {
              console.log(err)
            })
        })
    },
    getToken: function() {
      return localStorage.myPush
    },
    registerToAuth: function() {
      console.log("registering this token: " + localStorage.myPush);
      var tempToken = localStorage.myPush;
      // console.log("registering this token: "+$ionicPush.token.token);
      // var tempToken = $ionicPush.token.token;
      var token = tempToken.split(':');

      var currentAuthRef = Database.usersReference().child(User.auth().$id).child('device_token').child(token[0]);
      currentAuthRef.set(token[1]);
    }
  }

  return IonicPushService;
})
