app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,firebaseConfigProvider, $ionicCloudProvider) {

  firebase.initializeApp(firebaseConfigProvider.config);
  $urlRouterProvider.otherwise("/home");
  $ionicConfigProvider.tabs.position('bottom');

  $ionicCloudProvider.init({
    "core": {
      "app_id": "dd588ad9"
    },
    "push": {
      "sender_id": "155324175920",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  })

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
          templateUrl: "app/home/_home.html",
          controller: 'HomeTabCtrl',
          resolve : {
            currentAuth : function(Auth) {
              return Auth.$requireSignIn();
            },
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
          templateUrl: "app/restaurant/_view-restaurant.html",
          controller: "ViewRestaurantCtrl",
          resolve: {
            currentAuth : function(Auth) {
              return Auth.$requireSignIn();
            },
            currentUser : function(User) {
              return User.auth();
            }
          }
        }
      }
    })
    .state('tabs.restaurantMenus', {
      url: "/restaurantName/menus",
      params : {
        restaurantId : null
      },
      // url: "/restaurantName/menus/:restaurantId",
      views: {
        'restaurantmenus-tab' : {
          templateUrl: "app/menu/_view-restaurant-menus-order.html",
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
          templateUrl: "app/menu/_view-restaurant-menus.html",
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
          templateUrl: "app/menu/_add-menu.html",
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
          templateUrl: "app/menu/_menus.html",
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
          templateUrl: "app/user/_users.html",
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
          templateUrl: "app/cart/_cart.html",
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
          templateUrl:"app/order/_orders.html",
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
          templateUrl: "app/signup/_signup.html",
          controller: "SignUpCtrl"
        }
      }
    })
    .state('tabs.notifications', {
      url:"/notifications",
      views : {
        'notifications-tab' : {
          templateUrl: 'app/notification/_notifications.html',
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
      templateUrl: "app/login/_login.html",
      controller: "LoginCtrl"
    })
    .state('tabs.restaurant', {
      url: "/restaurant",
      views: {
        'restaurant-tab': {
          templateUrl: "app/restaurant/_restaurants.html",
          controller: "RestaurantCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })
    .state('tabs.myOrders', {
      url: "/myorders",
      views: {
        'myorders-tab': {
          templateUrl: "app/order/_my-orders.html",
          controller: "MyOrdersCtrl",
          resolve: {
            orders : function(User) {
              return User.getAuthOrders().$loaded();
            }
          }
        }
      }
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/signup/_signup.html",
      controller: "SignUpCtrl"
    })
    .state('tabs.profile', {
      url: "/profile",
      views: {
        'profile-tab': {
          templateUrl: "app/profile/_profile.html",
          controller: "ProfileCtrl"
        }
      }
    })
    .state('tabs.edit-profile', {
      url: "/edit-profile",
      views: {
        'profile-tab': {
          templateUrl: "app/profile/_edit-profile.html",
          controller: "ProfileCtrl"
        }
      }
    });


  $urlRouterProvider.otherwise("/tab/home");
})
