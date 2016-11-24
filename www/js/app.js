// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', ['ui.mask','ionic', 'ionic.cloud', 'ionMdInput', 'ionic-material', 'firebase', 'ionic.rating', 'uiGmapgoogle-maps', 'ngCordova', 'ngCordovaOauth', 'ion-datetime-picker', 'yaru22.angular-timeago', 'ui.select', 'ngSanitize'])

app.run(["$ionicPlatform", "$rootScope", "$state", '$templateCache', "IonicPushService", "User", "Database", "$cordovaGeolocation",
  function($ionicPlatform, $rootScope, $state, $templateCache, IonicPushService, User, Database, $cordovaGeolocation) {

    $ionicPlatform.ready()
      .then(() => {
        console.log('ready ionic');

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          IonicPushService.registerDevice();
        }

        var posOptions = {
          timeout: 10000,
          enableHighAccuracy: true
        }

        $cordovaGeolocation.getCurrentPosition(posOptions)
          .then((position) => {
            console.log('Position: ' + position.coords.latitude + ',' + position.coords.longitude);
          })
          .catch((err) => {
            if (window.cordova) {
              cordova.dialogGPS();
            }
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })




    $rootScope.$on("$stateChangeError",
      function(event, toState, toParams, fromState, fromParams, error) {
        if (error === "AUTH_REQUIRED") {
          event.preventDefault();
          $state.go("login")
        }
      })

      $rootScope.$on('cloud:push:notification', function(event, data) {
        var msg = data.message;
        alert(msg.title + ': ' + msg.text);
      })

    $templateCache.put('template.tpl.html', '');
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }]);


app.controller('AppCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, Auth, User, Database, $state, $ionicPush, IonicPushService, $ionicPopover) {
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.signOut = function() {
    $ionicLoading.show({
      template: '<p>Signing out . . .</p><ion-spinner></ion-spinner>',
      duration: 2000
    });
    Database.userOnlineTrue().$loaded().then(function(loaded) {
      loaded.$remove(0)
        .then((ref) => {
          console.log("success user loaded deleted");
          var firebaseUser = Auth.$getAuth();
          if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            var ionicToken = IonicPushService.getToken();
            var results = ionicToken.split(':');
            Database.usersReference().child(firebaseUser.uid).child('device_token').child(results[0]).set(null);
          }
          Auth.$signOut();
          location.reload();
          $ionicLoading.hide();
        })
        .catch((err) => {
          console.log(err)
        })
    });
    // facebookConnectPlugin.logout();
    // TwitterConnect.logout();
    // window.plugins.googleplus.disconnect();
  }

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      // $scope.firebaseUser = User.auth();
      // if (firebaseUser.displayName) {
      //   $scope.photoURL = firebaseUser.photoURL;
      // }
      User.auth().$loaded().then(function(data) {
        $scope.firebaseUser = data;
        if(data.photoURL) {
          $scope.photoURL = data.photoURL;
        }
      })
    }
  });
})

.controller('TabsCtrl', function($scope, Auth) {
  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    }
  });
});
