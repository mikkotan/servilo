// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', ['ui.mask', 'ionic', 'ionic.cloud', 'ionMdInput', 'ionic-material', 'firebase', 'ionic.rating', 'uiGmapgoogle-maps', 'ngCordova', 'ngCordovaOauth', 'ion-datetime-picker', 'yaru22.angular-timeago', 'ui.select', 'ngSanitize'])

app.run(["$ionicPlatform", "$rootScope", "$state", '$templateCache', "IonicPushService", "User", "Database", "$cordovaGeolocation", "$ionicPopup", "$cordovaPushV5",
  function($ionicPlatform, $rootScope, $state, $templateCache, IonicPushService, User, Database, $cordovaGeolocation, $ionicPopup, $cordovaPushV5) {
    $ionicPlatform.ready()
      .then(() => {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
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
                  console.log("Register Result: "+registerResult)
                  localStorage.myPush = registerResult;
                })
                .catch((err) => {
                  console.log(err)
                })
            })
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
      })
      .catch((err) => {
        console.log(err);
      })

    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
      console.log('received notification');
      console.log('DATA' + JSON.stringify(data, null, 4));

      console.log(data.additionalData.foreground);

      if (data.additionalData.foreground == true) {
        console.log('foreground true');
        $ionicPopup.alert({
          title: data.title,
          template: data.message
        })
          .then((res) => {
            if (res) {
              if (data.additionalData.url === 'reservation') {
                $state.go('tabs.myReservations');
              }
              else if (data.additionalData.url === 'order') {
                $state.go('tabs.myOrders');
              }
              else if (data.additionalData.url === 'order_status') {
                $state.go('tabs.myOrders');
              }
            }
          })
      }
      else {
        console.log('not in foreground')
        if (data.additionalData.url === 'reservation') {
          $state.go('tabs.myReservations');
        }
        else if (data.additionalData.url === 'order') {
          $state.go('tabs.myOrders');
        }
        else if (data.additionalData.url === 'order_status') {
          $state.go('tabs.myOrders');
        }
      }
    })

    $rootScope.$on("$stateChangeError",
      function(event, toState, toParams, fromState, fromParams, error) {
        if (error === "AUTH_REQUIRED") {
          event.preventDefault();
          $state.go("login")
        }
      })

    $templateCache.put('template.tpl.html', '');
  }]);

app.controller('AppCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, Auth, User, Database, $state, $ionicPush, IonicPushService, $ionicPopover) {
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  // $scope.hasData = function() {
  //     //get ng-model from input
  //     //if ng-model has value..add "used" class
  //     //if ng-model has no value...wala lang
  // };
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
            var ionicToken = localStorage.myPush;
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
      $scope.currentUser = User.auth();
      // $scope.firebaseUser = User.auth();
      // if (firebaseUser.displayName) {
      //   $scope.photoURL = firebaseUser.photoURL;
      // }
      User.auth().$loaded().then(function(data) {
        $scope.firebaseUser = data;
        if(data.photoURL) {
          $scope.photoURL = data.photoURL;
        }

        $scope.$watch('firebaseUser', function(newUser) {
          console.log('watching firebaseUser');
          $scope.newPhotoURL = newUser.photoURL;
        })
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

app.directive('googleplace', function() {
  return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?'
        },
        link: function(scope, element, attrs, model) {
          // this city bounds does not limit the search but biasing the search
          var cityBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(10.689760946107592, 122.43714093987364),
              new google.maps.LatLng(10.851652605488333, 122.63352155510802));
            var options = {
              bounds: cityBounds,
              componentRestrictions: {country: 'PH'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
              scope.$apply(function() {
                scope.details = scope.gPlace.getPlace().geometry.location;
                model.$setViewValue(element.val());
              });
            });
        }
    };
});
