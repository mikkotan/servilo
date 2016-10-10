app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,firebaseConfigProvider) {

  firebase.initializeApp(firebaseConfigProvider.config);
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
          templateUrl: "app/home/home.html",
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
          templateUrl: "app/restaurant/view-restaurant.html",
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
            templateUrl: "app/menu/view-restaurant-menus-order.html",
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
            templateUrl: "app/menu/view-restaurant-menus.html",
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
            templateUrl: "app/menu/add-menu.html",
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
            templateUrl: "app/menu/menus.html",
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
          templateUrl: "app/user/users.html",
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
          templateUrl: "app/cart/cart.html",
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
          templateUrl:"app/order/orders.html",
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
          templateUrl: "app/signup/signup.html",
          controller: "SignUpCtrl"
        }
      }
    })
    .state('tabs.notifications', {
      url:"/notifications",
      views : {
        'notifications-tab' : {
          templateUrl: 'app/notification/notifications.html',
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
      templateUrl: "app/login/login.html",
      controller: "LoginCtrl"
    })
    .state('tabs.restaurant', {
      url: "/restaurant",
      views: {
        'restaurant-tab': {
          templateUrl: "app/restaurant/restaurants.html",
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
      templateUrl: "app/signup/signup.html",
      controller: "SignUpCtrl"
    });


  $urlRouterProvider.otherwise("/tab/home");
})
