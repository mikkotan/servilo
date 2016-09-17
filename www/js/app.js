// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('todo', ['ionic', 'ionMdInput', 'ionic-material', 'firebase', 'ionic.rating', 'uiGmapgoogle-maps', 'ngCordova', 'ngCordovaOauth', 'ion-datetime-picker'])

app.run(["$ionicPlatform","$rootScope", "$state", '$templateCache',function($ionicPlatform , $rootScope , $state, $templateCache) {
  $rootScope.$on("$stateChangeError" ,
    function(event , toState , toParams , fromState , fromParams , error){
      if(error === "AUTH_REQUIRED"){
        event.preventDefault();
        $state.go("tabs.login")
      }
  })

  $templateCache.put('template.tpl.html', '');
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
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
        cache:false,
        abstract: true,
        templateUrl: "templates/tabs.html"
      })
      .state('tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/home.html",
            controller: 'HomeTabCtrl',
            resolve:{
              "currentAuth" : ["Auth", function(Auth){
                return Auth.$requireSignIn();
              }]
            }
          }
        }
      })
      .state('tabs.viewRestaurant', {
        url: "/viewRestaurant/:restaurantId",
        views: {
          'home-tab': {
            templateUrl: "templates/viewRestaurant.html",
            controller: "HomeTabCtrl",
            resolve:{
              "currentAuth" : ["Auth", function(Auth){
                return Auth.$requireSignIn();
              }]
            }
          }
        }
      })
      .state('tabs.addMenu',{
        url: "/menu/add/:restaurantId",
        views:{
          'restaurant-tab':{
            templateUrl: "templates/add-menu.html",
            controller: "MenuCtrl"
          }
        }
      })
      .state('tabs.viewRestaurantMenus',{
        url: "/restaurant/menus/:restaurantId",
        views:{
          'restaurant-tab':{
            templateUrl: "templates/viewRestaurant-menus.html",
            controller: "MenuCtrl"
          }
        }
      })
      .state('tabs.facts2', {
        url: "/facts2",
        views: {
          'home-tab': {
            templateUrl: "templates/facts2.html"
          }
        }
      })
      .state('tabs.menu', {
        url: "/menu",
        views: {
          'menu-tab': {
            templateUrl: "templates/menus.html",
            controller:"MenuCtrl"
          }
        }
      })
      .state('tabs.navstack', {
        url: "/navstack",
        views: {
          'about-tab': {
            templateUrl: "templates/nav-stack.html"
          }
        }
      })
      .state('tabs.contact', {
        url: "/contact",
        views: {
          'contact-tab': {
            templateUrl: "templates/contact.html",
            controller : "UsersCtrl"
          }
        }

    })
    .state('tabs.cart',{
      url: "/cart",
      views:{
        'cart-tab':{
          templateUrl:"templates/cart.html",
          controller:"CartCtrl",
          resolve:{
            "currentAuth":["Auth", function(Auth){
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })
    .state('tabs.signup',{
      url:"/signup",
      views: {
        'signup-tab': {
            templateUrl : "templates/signup.html",
            controller : "SignUpCtrl"
          }
        }
      })
      .state('login', {
        url: "/login",
      //   views: {
      //     'login-tab': {
            templateUrl: "templates/login.html",
            controller: "LoginCtrl"
      //     }
      //   },
      //   resolve : {
        //
      //   }
      })
      .state('tabs.restaurant', {
        url: "/restaurant",
        views: {
          'restaurant-tab': {
            templateUrl : "templates/restaurant.html",
            controller: "RestaurantCtrl",
            resolve:{
              "currentAuth" : ["Auth", function(Auth){
                return Auth.$requireSignIn();
              }]
            }
          }
        }
      })
      .state('signup',{
        url:"/signup",
      //   views: {
      //     'signup-tab': {
              templateUrl : "templates/signup.html",
              controller : "SignUpCtrl"
      //     }
      //   }
      });
    $urlRouterProvider.otherwise("/tab/home");
})


.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, Auth, User) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.signOut = function() {
    Auth.$signOut();
    console.log("logged out..");
    location.reload();
  }
  Auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
      if(firebaseUser.providerData[0].providerId == "facebook.com") {
        console.log("facebook provider");
        $scope.firebaseUser = firebaseUser.displayName;
        $scope.photoURL = firebaseUser.providerData[0].photoURL;
      }
      else { //providerId == password
        console.log("email provider");
        // var user = User.auth();
        // user.$loaded().then(function() {
        //   $scope.firebaseUser = user.firstName + " " + user.lastName;
        // })
        $scope.firebaseUser = User.auth();
      }
    }
  })
})
