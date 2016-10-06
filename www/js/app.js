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

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  var config = {
    apiKey: "AIzaSyA9E-lSM2WKmonVkHCShv_ErYuvobxgb40",
    authDomain: "jepsrestaurantdev.firebaseapp.com",
    databaseURL: "https://jepsrestaurantdev.firebaseio.com",
    storageBucket: "jepsrestaurantdev.appspot.com",
  };
  firebase.initializeApp(config);
  $urlRouterProvider.otherwise("/home");
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('tabs', {
      url: "/tab",
      cache: false,
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl',
          resolve : {
            // currentAuth : function(Auth) {
            //   return Auth.$requireSignIn();
            // },
            restaurants : function(Database) {
              return Database.restaurants().$loaded();
            }
          }
        }
      }
    })
    .state('tabs.viewRestaurant', {
      url: "/viewRestaurant/:restaurantId",
      views: {
        'home-tab': {
          templateUrl: "templates/viewRestaurant.html",
          controller: "ViewRestaurantCtrl",
          resolve: {
            // currentAuth : function(Auth) {
            //   return Auth.$requireSignIn();
            // },
            // currentUser : function(User) {
            //   return User.auth();
            // }
            // review : function(Review , $stateParams){
            //   return {
            //     userReview : Review.userReview($stateParams.restaurantId).$loaded(),
            //     restaurantReview : Review.userReview($stateParams.restaurantId).$loaded()
            //     }
            //   }
            // userReview : function($stateParams , Review){
            //   return Review.userReview($stateParams.restaurantId).$loaded();
            // },
            // restaurantReview : function($stateParams , Review){
            //   return Review.restaurantReview($stateParams.restaurantId).$loaded();
            // }
          }
        }
      }
      })
      .state('tabs.restaurantMenus', {
        url: "/restaurantName/menus/:restaurantId",
        views: {
          'restaurantmenus-tab' : {
            templateUrl: "templates/restaurantMenus.html",
            controller: "ViewRestaurantMenuOrder",
            resolve: {
              restaurantMenus : function(Menu , $stateParams){
                  return Menu.getRestaurantMenus($stateParams.restaurantId).$loaded();
              },
              restaurantId : function($stateParams){
                return $stateParams.restaurantId
              }
            }
          }
        }
      })
      .state('tabs.viewRestaurantMenus', {
        url: "/restaurant/menus/:restaurantId",
        views: {
          'restaurant-tab': {
            templateUrl: "templates/view-restaurant-menus.html",
            controller: "ViewRestaurantMenu",
            resolve: {
              restaurantMenu : function(Menu , $stateParams){
                  return Menu.getRestaurantMenus($stateParams.restaurantId).$loaded();
              }
            }
          }
        }
        })
      .state('tabs.addMenu',{
        url: "/menu/add/:restaurantId",
        views:{
          'restaurant-tab':{
            templateUrl: "templates/add-menu.html",
            controller: "AddMenuCtrl",
            resolve: {
              menus : function(Menu){
                  return Menu.all().$loaded();
              },
              restaurantId : function($stateParams){
                return $stateParams.restaurantId
              }
            }
          }
        }
    })
      .state('tabs.menu', {
        url: "/menu",
        views: {
          'menu-tab': {
            templateUrl: "templates/menus.html",
            controller:"MenuCtrl",
            resolve: {
              menus : function(Menu){
                return Menu.all().$loaded();
              }
            }
          }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html",
          controller: "UsersCtrl"
        }
      }
    })
    .state('tabs.cart', {
      url: "/cart",
      params : {
        restaurantId : null
      },
      views: {
        'cart-tab': {
          templateUrl: "templates/cart.html",
          controller: "CartCtrl",
          resolve : {
            orders : function(Order){
              return Order.all().$loaded();
            },
            authUser : function(User){
              return User.auth().$loaded();
            },
            restaurantId : function($stateParams){
              return $stateParams.restaurantId
            }
          }
        }
      }
    })

    .state('tabs.orders',{
      url: "/orders",
      views:{
        'order-tab':{
          templateUrl:"templates/order.html",
          controller:"OrderCtrl",
          resolve: {
            restaurants : function(Restaurant){
              return Restaurant.getAuthUserRestaurants().$loaded();
            }
          }
        }
      }
    })
    .state('tabs.signup',{
      url:"/signup",
      views: {
        'signup-tab': {
          templateUrl: "templates/signup.html",
          controller: "SignUpCtrl"
        }
      }
    })
    .state('tabs.notifications', {
      url:"/notifications",
      views : {
        'notifications-tab' : {
          templateUrl: 'templates/notifications.html',
          controller: "NotificationsCtrl",
          resolve : {
            notifications : function(User) {
              return User.getAuthNotifications().$loaded();
            }
          }
        }
      }
    })
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginCtrl"
    })
    .state('tabs.restaurant', {
      url: "/restaurant",
      views: {
        'restaurant-tab': {
          templateUrl: "templates/restaurant.html",
          controller: "RestaurantCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html",
      controller: "SignUpCtrl"
    });


  $urlRouterProvider.otherwise("/tab/home");
})


.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, Auth, User, Database) {
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
    })
  }

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      if (firebaseUser.providerData[0].providerId == "facebook.com") {
        console.log("facebook provider");
        $scope.firebaseUser = firebaseUser;
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
    else {
      console.log("NOT LOGGED IN")
    }
  });
})

.controller('TabsCtrl', function($scope, Auth) {
  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    }
    else {
      console.log("NOT LOGGED IN SA TABS")
    }
  });
});