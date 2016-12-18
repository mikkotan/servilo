app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, firebaseConfigProvider, $ionicCloudProvider, ionGalleryConfigProvider) {
  ionGalleryConfigProvider.setGalleryConfig({
    action_label: 'Close',
    toggle: true,
    row_size: 4,
    fixed_row_size: true
  });
  firebase.initializeApp(firebaseConfigProvider.$get());

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
          controllerAs: 'home',
          resolve: {
            currentAuth: function(Auth) {
              return Auth.$requireSignIn();
            },
          }
        }
      }
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
            // restaurants: function(Database) {
            //   return Database.restaurants().$loaded();
            // }
            currentGeoLocation: function(CordovaGeolocation) {
              return CordovaGeolocation.get();
            }
          }
        }
      }
    })
    .state('tabs.viewRestaurant', {
      abstract: true,
      url: "/viewRestaurant/:restaurantId",
    //   templateUrl: "app/restaurant/_view-restaurant.html"
      views: {
        'search-tab': {
          templateUrl: "app/restaurant/_view-restaurant.html",
          controller: "ViewRestaurantCtrl",
          resolve: {
            currentAuth: function(Auth) {
              return Auth.$requireSignIn();
            },
            currentUser: function(User) {
              return User.auth();
            }
          }
        }
      }
    })
    .state('tabs.viewRestaurant.main', {
      url: "/main",
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
      }
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
      }
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
      }
    })
    .state('tabs.viewRestaurant.menus', {
      url: "/menus",
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
      }
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
            }
          }
        }
      }
    })
    // .state('tabs.addMenu', {
    //   url: "/menu/add/:restaurantId",
    //   views: {
    //     'restaurant-tab': {
    //       templateUrl: "app/menu/_add-menu.html",
    //       controller: "AddMenuCtrl",
    //       resolve: {
    //         // menus: function(Menu) {
    //         //   return Menu.all().$loaded();
    //         // },
    //         restaurantId: function($stateParams) {
    //           return $stateParams.restaurantId
    //         }
    //       }
    //     }
    //   }
    // })
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
      params: {
        restaurantId: null
      },
      views: {
        'cart-tab': {
          templateUrl: "app/cart/_cart.html",
          controller: "CartCtrl",
          resolve: {
            orders: function(Order) {
              return Order.all().$loaded();
            },
            authUser: function(User) {
              return User.auth().$loaded();
            },
            restaurantId: function($stateParams) {
              return $stateParams.restaurantId
            }
          }
        }
      }
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
      }
    })
    .state('tabs.notifications', {
      url: "/notifications",
      views: {
        'notifications-tab': {
          templateUrl: 'app/notification/_notifications.html',
          controller: "NotificationsCtrl",
          resolve: {
            notifications: function(User) {
              return User.getAuthNotifications().$loaded();
            }
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
            orders: function(User) {
              return User.getAuthOrders().$loaded();
            }
          }
        }
      }
    })
    .state('tabs.myReservations', {
      url: "/myreservations",
      views: {
        'myreservations-tab': {
          templateUrl: "app/reservation/_my-reservations.html",
          controller: "MyReservationsCtrl",
          resolve: {
            "reservations": function(User) {
              return User.getAuthReservations().$loaded();
            }
          }
        }
      }
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
      }
    })
    .state('tabs.dashboard.reservations', {
      url: "/reservations",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact-reservations.html",
          controller: "DashboardInteractReservationsCtrl"
        }
      }
    })
    .state('tabs.dashboard.reviews', {
      url: "/reviews",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact-reviews.html",
          controller: "ViewRestaurantCtrl"
        }
      }
    })
    .state('tabs.dashboard.promos', {
      url: "/promos",
      params: {
        restaurantId: null
      },
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact-promos.html",
          controller: "DashboardInteractPromosCtrl"
        }
      }
    })
    .state('tabs.dashboard.main', {
      url: "/main",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-main.html",
          controller: "DashboardMainCtrl"
        }
      }
    })
    .state('tabs.dashboard.menus', {
      url: "/menus",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-menus.html",
          controller: "DashboardMenusCtrl"
        }
      }
    })
    .state('tabs.dashboard.interact', {
      url: "/interact",
      views: {
        'dashboard-page': {
          templateUrl: "app/dashboard/_dashboard-interact.html",
          controller: "DashboardInteractCtrl"
        }
      }
    })
    .state('tabs.restaurant', {
      url: "/restaurant",
      views: {
        'restaurant-tab': {
          templateUrl: "app/restaurant/_restaurants.html",
          controller: "RestaurantCtrl"
        }
      }
    })
    .state('landing', {
      url: "/landing",
      templateUrl: "app/login/_landing.html",
      controller: "LoginCtrl"
    })
    .state('login', {
      url: "/login",
      templateUrl: "app/login/_login.html",
      controller: "LoginCtrl"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/signup/_signup.html",
      controller: "SignUpCtrl"
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "app/profile/_profile.html",
      controller: "ProfileCtrl"
    })
    .state('edit-profile', {
      url: "/edit-profile",
      templateUrl: "app/profile/_edit-profile.html",
      controller: "ProfileCtrl"
    });
  $urlRouterProvider.otherwise("/tab/home");
})
