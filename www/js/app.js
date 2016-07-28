// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('todo', ['ionic', 'ionMdInput', 'ionic-material', 'firebase'])

app.run(["$ionicPlatform","$rootScope", "$state",function($ionicPlatform , $rootScope , $state) {

  $rootScope.$on("$stateChangeError" ,
    function(event , toState , toParams , fromState , fromParams , error){
      if(error === "AUTH_REQUIRED"){
        event.preventDefault();
        $state.go("tabs.login")
      }

  })


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






app.config(function($stateProvider, $urlRouterProvider) {

  var config = {
    apiKey: "AIzaSyA9E-lSM2WKmonVkHCShv_ErYuvobxgb40",
    authDomain: "jepsrestaurantdev.firebaseapp.com",
    databaseURL: "https://jepsrestaurantdev.firebaseio.com/",
    storageBucket: "gs://jepsrestaurantdev.appspot.com"
  };
  firebase.initializeApp(config);

  $stateProvider
    .state('tabs', {
      url: "/tab",
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
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html",
          controller:"Upload"
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

    .state('tabs.login', {
      url: "/login",
      views: {
        'login-tab': {
          templateUrl: "templates/login.html",
          controller: "LoginCtrl"
        }
      }
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

    .state('tabs.signup',{
      url:"/signup",
      views: {
        'signup-tab': {
            templateUrl : "templates/signup.html",
            controller : "SignUpCtrl"
        }
      }
    });

   $urlRouterProvider.otherwise("/tab/home");

})
