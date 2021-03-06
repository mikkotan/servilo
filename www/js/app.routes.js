app.config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider","firebaseConfigProvider","$ionicCloudProvider","ionGalleryConfigProvider",
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, firebaseConfigProvider,
      $ionicCloudProvider, ionGalleryConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.navBar.alignTitle('center');
  ionGalleryConfigProvider.setGalleryConfig({
    action_label: 'Close',
    toggle: true,
    row_size: 3,
    fixed_row_size: true
  });

  firebase.initializeApp(firebaseConfigProvider.$get());


  $urlRouterProvider.otherwise(function($injector,$location){
      $injector.invoke(['$state',function($state){
        $state.go('tabs.home')
      }])
  })

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
      templateUrl: "templates/tabs.html",
      controller: 'TabsCtrl',
      class : 'Tab'
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "app/home/_home.html",
          controller: 'HomeTabCtrl',
          controllerAs: 'home',
          resolve : {
            currentAuth: function(Auth) {
              console.log("resolve home fired inside view!!!");
              return Auth.$requireSignIn();
            }
          }
        },
      },
      class : 'Home'
    })
    .state('tabs.pending', {
      url: "/pending",
      views: {
        'pending-tab': {
          templateUrl: "app/pendingrestaurant/_pending-restaurant.html",
          controller: 'PendingCtrl',
          resolve: {
            currentAuth: function(Auth) {
              return Auth.$requireSignIn();
            }
          }
        }
      },
      class : 'Pending'
    })
    .state('tabs.search', {
      url: "/search",
      views: {
        'search-tab': {
          templateUrl: "app/search/_search.html",
          controller: 'SearchTabCtrl',
          resolve: {
            currentAuth: function(Auth) {
              return Auth.$requireSignIn();
            },
            currentGeoLocation: function(CordovaGeolocation) {
              return CordovaGeolocation.get();
            }
          }
        }
      },
      class : 'Search'
    })
    .state('tabs.viewRestaurant', {
      abstract: true,
      url: "/viewRestaurant/:restaurantId",
      views: {
        'search-tab': {
          templateUrl: "app/restaurant/_view-restaurant.html",
          // controller: "ViewRestaurantCtrl",
          resolve: {
            currentAuth: function(Auth) {
              return Auth.$requireSignIn();
            },
            currentUser: function(User) {
              return User.auth();
            }
          }
        }
      },
      class : 'ViewRestaurant'
    })
    .state('tabs.viewRestaurant.main', {
      url: "/main",
      params:{
        restaurantId : null
      },
      views: {
        'restaurant_page': {
          templateUrl: "app/restaurant/_view-restaurant-main.html",
          controller: "ViewRestaurantCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }],
            restaurantId: function($stateParams) {
              return $stateParams.restaurantId
            }
          }
        }
      },
      class : 'Restaurant'
    })
    .state('tabs.viewRestaurant.reviews', {
      url: "/reviews",
      views: {
        'restaurant_page': {
          templateUrl: "app/review/_all-reviews.html",
          controller: "ReviewCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }],
            restaurantId: function($stateParams) {
              return $stateParams.restaurantId
            }
          }
        }
      },
      class : 'Restaurant'
    })
    .state('tabs.viewRestaurant.gallery', {
      url: "/gallery",
      views: {
        'restaurant_page': {
          templateUrl: "app/gallery/_gallery.html",
          controller: "GalleryCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }],
          }
        }
      },
      class : 'Restaurant'
    })
    .state('tabs.viewRestaurant.menus', {
      url: "/menus",
      params:{
        restaurantId  : null
      },
      views: {
        'restaurant_page': {
          templateUrl: "app/restaurant/_view-restaurant-menus.html",
          controller: "ViewRestaurantMenus",
          resolve: {
            // restaurantMenus: function(Restaurant, $stateParams) {
            //   return Restaurant.getMenus($stateParams.restaurantId).$loaded();
            // },
            restaurantId: function($stateParams) {
              return $stateParams.restaurantId
            }
          }
        }
      },
      class : 'Restaurant'
    })
    .state('tabs.viewRestaurant.location', {
      url: "/location",
      views: {
        'restaurant_page': {
          templateUrl: "app/restaurant/_view-restaurant-location.html",
          controller: "ViewRestaurantLocation",
          resolve: {
            currentGeoLocation: function(CordovaGeolocation) {
              return CordovaGeolocation.get();
            },
            restaurantId: function($stateParams) {
              return $stateParams.restaurantId
            }
          }
        }
      },
      class : 'Restaurant'
    })
    .state('tabs.menu', {
      url: "/menu",
      views: {
        'menu-tab': {
          templateUrl: "app/menu/_menus.html",
          controller: "MenuCtrl",
          resolve: {
            menus: function(Menu) {
              return Menu.all().$loaded();
            }
          }
        }
      },
        class : 'Menu'
    })
    .state('tabs.dashboard.orders', {
      url: "/orders",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact-orders.html",
          controller: "DashboardInteractOrdersCtrl"
        }
      },
      class : 'Order'
    })
    .state('notifications', {
      url: "/notifications",
      templateUrl: 'app/notification/_notifications.html',
      controller: "NotificationsCtrl",
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }],
        "notifications": ["User",function(User) {
          return User.getAuthNotifications().$loaded();
        }]
      },
      class : 'Notification'
    })

  .state('tabs.myOrders', {
      url: "/myorders",
      views: {
        'myorders-tab': {
          templateUrl: "app/order/_my-orders.html",
          controller: "MyOrdersCtrl",
          resolve: {
            orders: function(User) {
              return User.getAuthOrders().$loaded();
            }
          }
        }
      },
      class : 'MyOrder'
    })
    .state('tabs.myReservations', {
      url: "/myreservations",
      views: {
        'myreservations-tab': {
          templateUrl: "app/reservation/_my-reservations.html",
          controller: "MyReservationsCtrl",
          resolve: {
            reservations: function(User) {
              return User.getAuthReservations().$loaded();
            }
          }
        }
      },
      class : 'MyReservation'
    })
    .state('tabs.dashboard', {
      url: "/dashboard/:restaurantId",
      views: {
        'restaurant-tab': {
          templateUrl: "app/dashboard/_dashboard.html",
          // controller: "DashboardCtrl",
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireSignIn();
            }],
            currentGeoLocation: function(CordovaGeolocation) {
              return CordovaGeolocation.get();
            }
          }
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.reservations', {
      url: "/reservations",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page' : {
          templateUrl: "app/dashboard/_dashboard-interact-reservations.html",
          controller: "DashboardInteractReservationsCtrl"
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.reviews', {
      url: "/reviews",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page' : {
          templateUrl: "app/dashboard/_dashboard-interact-reviews.html",
          controller: "ViewRestaurantCtrl"
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.promos', {
      url: "/promos",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page' : {
          templateUrl: "app/dashboard/_dashboard-interact-promos.html",
          controller: "DashboardInteractPromosCtrl"
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.main', {
      url: "/main",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-main.html",
          controller: "DashboardMainCtrl"
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.menus', {
      url: "/menus",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-menus.html",
          controller: "DashboardMenusCtrl"
          }
        },
      class : 'Dashboard'
    })
    .state('tabs.dashboard.interact', {
      url: "/interact",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact.html",
          controller: "DashboardInteractCtrl"
        }
      },
      class : 'Dashboard'
    })
    .state('tabs.restaurant', {
      url: "/restaurant",
      views: {
        'restaurant-tab': {
          templateUrl: "app/restaurant/_restaurants.html",
          controller: "RestaurantCtrl"
        }
      },
        class : 'ViewRestaurant'
    })
    .state('landing', {
      url: "/landing",
      templateUrl: "app/login/_landing.html",
      controller: "LoginCtrl",
      class:'Login',
    })
    .state('login', {
      url: "/login",
      templateUrl: "app/login/_login.html",
      controller: "LoginCtrl",
      class:'Login',
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/signup/_signup.html",
      controller: "SignUpCtrl",
      class:'Signup'
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "app/profile/_profile.html",
      controller: "ProfileCtrl",
      class:"Profile"
    })
    .state('edit-profile', {
      url: "/edit-profile",
      templateUrl: "app/profile/_edit-profile.html",
      controller: "ProfileCtrl",
      class:'Profile'
    });
}])
