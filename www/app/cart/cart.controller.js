app.controller("CartCtrl", ["$scope", "User", "CartData", "Cart", "Database", "Restaurant", "CordovaGeolocation", "$ionicPopup", "ionicToast", "Notification", "Order", "$ionicLoading",
  function($scope, User, CartData, Cart, Database, Restaurant, CordovaGeolocation, $ionicPopup, ionicToast, Notification, Order, $ionicLoading) {

    // $scope.order = Database.orders();

    $scope.cart = CartData.get();
    $scope.data = {};
    $scope.countryCode = 'PH';


    $scope.add = function(orderMenu) {
      var order = $scope.cart.menus.indexOf(orderMenu);
      $scope.cart.menus[order].quantity += 1;
    };

    $scope.showMap = function() {
      var lat = $scope.marker.coords.latitude;
      var long = $scope.marker.coords.longitude;
      $scope.setMarker(lat, long);
      var mapPopup = $ionicPopup.confirm({
        title: 'Set Markers',
        templateUrl: 'app/restaurant/_googleMapsPopout.html',
        cssClass: 'custom-popup',
        scope: $scope
      });
      mapPopup.then(function(res) {
        if (res) {
          $scope.placeName($scope.marker.coords.latitude, $scope.marker.coords.longitude);
        }
      });
    };

    $scope.minus = function(orderMenu) {
      var menu = $scope.cart.menus.indexOf(orderMenu);
      var menuId = Cart.menuId($scope.cart.totalPrice, "id", orderMenu.id)

      if ($scope.cart.menus[menu].quantity > 0) {
        $scope.cart.menus[menu].quantity -= 1;
        if ($scope.cart.menus[menu].quantity <= 0) {
          $scope.cart.menus.splice(menu, 1);
          $scope.cart.totalPrice.splice(menuId, 1);
        }
      }
    };

    $scope.delete = function(orderMenu) {
      var menu = $scope.cart.menus.indexOf(orderMenu);
      var menuId = Cart.menuId($scope.cart.totalPrice, "id", orderMenu.id)

      var deletePopup = $ionicPopup.confirm({
        title: 'Delete order?',
        template: 'Are you sure you want to delete?',
        cssClass: 'delete-popup',
        scope: $scope
      });

      deletePopup.then(function(res) {
        if (res) {
          $scope.cart.menus.splice(menu, 1);
          $scope.cart.totalPrice.splice(menuId, 1)
          if(CartData.isEmpty()){
            $scope.restaurantCart.hide();
          }

        }
      });

    };
    $scope.$watch('cart', function(newCart , oldMenus) {
        $scope.menus = newCart.menus.map(function(menu) {
          CartData.addToTotalPrice(menu);
            return {
              menu: menu,
              subtotal: menu.price * menu.quantity,
            }
        })
        $scope.total = CartData.totalPrice();
    }, true);

    $scope.useCurrent = function() {
      var currentLocation = CordovaGeolocation.get();
      $scope.setMarker(currentLocation.latitude, currentLocation.longitude);
      Restaurant.getLocation(currentLocation.latitude, currentLocation.longitude).then(function(data) {
        $scope.data.location = data;
        //   $scope.data.location.geometry.location.lat = currentLocation.latitude;
        //   $scope.data.location.geometry.location.lng = currentLocation.longitude;
        // $scope.restaurant.location = data
        // console.log($scope.restaurant.location)
      });
    }

    var scanCart = function(Cart) {
      var scanMenu = []
      for (var i = 0; i < Cart.length; i++) {
        scanMenu.push({
          id: Cart[i].menu.id,
          quantity: Cart[i].menu.quantity,
        });
      }
      return scanMenu;
    }

    $scope.hideCartModal = function() {
      $scope.restaurantCart.hide();
    }


    $scope.buy = function(cart) {
      console.log($scope.marker.coords);
      $ionicLoading.show();

      var location = $scope.data.location.formatted_address;
      if (location) {
        Order.create({
            restaurant_id: $scope.restaurantId,
            customer_id: User.auth().$id,
            order_details: {
              location: location,
              latitude: $scope.marker.coords.latitude,
              longitude: $scope.marker.coords.longitude,
              menus: scanCart(cart),
              note: typeof cart.note === 'undefined' ? '' : cart.note,
              totalprice: $scope.total,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              status: 'pending',
            },
            orderStatus: {
              cancelled: false,
              confirmed: false
            },
          })
          .then(() => {
            $scope.hideCartModal();
            CartData.setNull();
            console.log('restaurantOrder done');
            var restaurant_owner = Restaurant.getOwner($scope.restaurantId);
            Notification.create({
                sender_id: User.auth().$id,
                receiver_id: restaurant_owner.$id,
                restaurant_id: $scope.restaurantId,
                type: 'order',
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
              .then(() => {
                $ionicLoading.hide();
                ionicToast.show('SUCCESS', 'bottom', false, 2500);
              })
              .catch((err) => {
                $ionicLoading.hide();
             console.log(error);
              })
          })
          .catch((error) => {
            $ionicLoading.hide();
            console.log(error);
          });
      } else {
        alert("please fill up Location");
        ionicToast.show('NO LOCATION', 'bottom', false, 2500);
      }
    }


    //Setting the map
    $scope.currentLocation = CordovaGeolocation.get();
    $scope.marker = {
      id: 0
    };

    $scope.map = {
      center: {
        latitude: 10.73016704689235,
        longitude: 122.54616022109985
      },
      zoom: 13,
      options: {
        scrollwheel: false
      },
      bounds: {},
      refresh: true,
      events: {
        tilesloaded: function(map) {
          $scope.$apply(function() {
            google.maps.event.trigger(map, "resize");
          });
        },
        click: function(map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
          var m = {
            id: Date.now(),
            coords: {
              latitude: lat,
              longitude: lon
            }
          };
          $scope.marker = m;
          $scope.placeName($scope.marker.coords.latitude, $scope.marker.coords.longitude);
          $scope.$apply();
        }
      }
    };

    //Mark the current location function here !!!
    $scope.markLocation = function() {
      $scope.currentLocation = CordovaGeolocation.get();
      $scope.setMarker($scope.currentLocation.latitude, $scope.currentLocation.longitude);
      $scope.placeName($scope.currentLocation.latitude, $scope.currentLocation.longitude);
    }

    //function that converts LatLng coordinates to word
    $scope.placeName = function(latitude, longitude) {
      Restaurant.getLocationName(latitude, longitude).then(function(data) {
        $scope.restaurant.location = data
      });
    }

    $scope.setMarker = function(latitude, longitude) {
      $scope.marker = {
        id: Date.now(),
        coords: {
          latitude: latitude,
          longitude: longitude
        }
      };
      $scope.map.center = {
        latitude: latitude,
        longitude: longitude
      };
    }

  }
]);
