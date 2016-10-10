// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', ['ui.mask','ionic', 'ionMdInput', 'ionic-material', 'firebase', 'ionic.rating', 'uiGmapgoogle-maps', 'ngCordova', 'ngCordovaOauth', 'ion-datetime-picker', 'yaru22.angular-timeago'])

app.run(["$ionicPlatform", "$rootScope", "$state", '$templateCache', function($ionicPlatform, $rootScope, $state, $templateCache) {
  $rootScope.$on("$stateChangeError",
    function(event, toState, toParams, fromState, fromParams, error) {
      if (error === "AUTH_REQUIRED") {
        event.preventDefault();
        $state.go("login")
      }
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

app.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, Auth, User, Database,$state) {
  $scope.showMenu = function() {
  $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.signOut = function() {
    Database.userOnlineTrue().$loaded().then(function(loaded){
      loaded.$remove(0).then(function(ref){
        console.log("success")
        Auth.$signOut();
        location.reload();
      }).catch(function(err){
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      if (firebaseUser.providerData[0].providerId == "facebook.com") {
        console.log("facebook provider");
        $scope.firebaseUser = firebaseUser.displayName;
        $scope.photoURL = firebaseUser.providerData[0].photoURL;
      } else { //providerId == password
        console.log("email provider");
        // var user = User.auth();
        // user.$loaded().then(function() {
        //   $scope.firebaseUser = user.firstName + " " + user.lastName;
        // })
        $scope.firebaseUser = User.auth();
      }
    }
  });
})
