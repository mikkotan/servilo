// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('app', ['ui.mask', 'ionic', 'ionic.cloud', 'ionMdInput', 'ionic-material', 'ion-floating-menu', 'firebase', 'ionic.rating', 'ionic-toast', 'uiGmapgoogle-maps', 'ngCordova', 'ngCordovaOauth', 'ion-datetime-picker', 'yaru22.angular-timeago', 'ui.select', 'ngSanitize', '$actionButton', 'ion-gallery', 'ionicLazyLoad', 'ionic.contrib.ui.hscrollcards', 'ion-google-autocomplete'])

app.run(["$ionicPlatform", "$rootScope", "$state", '$templateCache', "IonicPushService", "User", "Database", "$cordovaGeolocation", "$ionicPopup", "$cordovaPushV5", "Cart", "$ionicLoading",
  function($ionicPlatform, $rootScope, $state, $templateCache, IonicPushService, User, Database, $cordovaGeolocation, $ionicPopup, $cordovaPushV5, Cart, $ionicLoading) {
    $ionicPlatform.ready()
      .then(() => {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          // IonicPushService.registerDevice();
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
      if (data.additionalData.foreground == true) {
        console.log('foreground true');
        $ionicPopup.alert({
            title: data.title,
            template: data.message
          })
          .then((res) => {
            if (res) {
              if (data.additionalData.url === 'reservation') {
                $state.go('tabs.restaurant')
                  .then(() => {
                    $state.go('tabs.dashboard.reservations', {restaurantId: data.additionalData.restaurant_id});
                  })
              } else if (data.additionalData.url === 'order') {
                $state.go('tabs.restaurant')
                  .then(() => {
                    $state.go('tabs.dashboard.orders', {restaurantId: data.additionalData.restaurant_id})
                  })
              } else if (data.additionalData.url === 'order_status') {
                $state.go('tabs.myOrders');
              }
            }
          })
      } else {
        console.log('not in foreground')
        if (data.additionalData.url === 'reservation') {
          $state.go('tabs.dashboard.reservations', {restaurantId: data.additionalData.restaurant_id});
        } else if (data.additionalData.url === 'order') {
          console.log(data.additionalData.restaurant_id);
          $state.go('tabs.dashboard.orders', {restaurantId: data.additionalData.restaurant_id});
        } else if (data.additionalData.url === 'order_status') {
          $state.go('tabs.myOrders');
        }
      }
    })

    $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {
      console.log(e.message);
    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

      if (typeof fromState.views.restaurant_page !== "undefined" && typeof toState.views.restaurant_page == "undefined") {
        if (!Cart.isEmpty()) {
          event.preventDefault();

          var leavingRestaurantPopup = $ionicPopup.confirm({
            title: 'Leaving this restaurant will delete your orders',
            template: 'Are you sure you want to leave?',
            cssClass: 'delete-popup',
          });

          leavingRestaurantPopup.then(function(res) {
            if (res) {
              Cart.setNull();
              event.defaultPrevented = false;
              $state.go(toState.name);
            } else {
              console.log("ngaa gn cancel mo?");
            }
          });

        } else {
          console.log("HI");
        }

      } else if (toState) {
        $ionicLoading.show();
      } else {
        console.log("Free Will")
      }
    })
    $rootScope.$on("$stateChangeSuccess",
      function(event, toState, toParams, fromState, fromParams, options) {
        $ionicLoading.hide();
      })

    $rootScope.$on("$stateChangeError",
      function(event, toState, toParams, fromState, fromParams, error) {
        $ionicLoading.hide()
        if (error === "AUTH_REQUIRED") {
          event.preventDefault();
          $state.go("landing")
        }
      })

    $templateCache.put('template.tpl.html', '');
  }
]);

app.controller('AppCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, Auth, User, Database, $state, $ionicPush, IonicPushService, $ionicPopover, $cordovaPushV5, Cart, ionicMaterialInk) {
  ionicMaterialInk.displayEffect();
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.showRightMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.$watch(
    function() {
      return $ionicSideMenuDelegate.getOpenRatio();
    },
    function(ratio) {
      $scope.sidemenuopened = (ratio == 1);
    });

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
          $cordovaPushV5.unregister();
          Auth.$signOut();
          //   location.reload();
          $ionicLoading.hide();
          $state.go("landing");
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
        if (data.photoURL) {
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

.controller('TabsCtrl', function($scope, $state, Auth) {
  $scope.goToHome = function() {
    $state.go("tabs.home")
  }
  $scope.goToOrders = function() {
    $state.go("tabs.orders")
  }
  $scope.goToNotifications = function() {
    $state.go("tabs.notifications")
  }
  $scope.goToRestaurants = function() {
    $state.go("tabs.home")
  }
  $scope.goToMyOrders = function() {
    $state.go("tabs.myOrders")
  }
  $scope.goToMyReservations = function() {
    $state.go("tabs.myReservations")
  }
  $scope.goToMyRestaurant = function() {
      $state.go("tabs.restaurant")
    }
    // $scope.$on("$ionicView.beforeEnter", function(event, data){
    //   console.log("FROM IONIC VIEW EVENT")
    //   console.log(event);
    // });

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    }
  });

});
app.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-balanced');
        if (newVal === scope.value) {
          element.addClass('button-balanced');
        }
      });
    }
  };
});
