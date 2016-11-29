app.controller("CartCtrl", ["$scope", "User", "CartData", "Cart", "Database", "Restaurant", "CordovaGeolocation", "$ionicPopup",
  function($scope, User, CartData, Cart, Database, Restaurant, CordovaGeolocation, $ionicPopup) {

    $scope.order = Database.orders();



    $scope.cartData = CartData.get();
    $scope.totalPrice = CartData.totalPrice();

    $scope.add = function(orderMenu) {
      var order = $scope.cartData.indexOf(orderMenu);
      $scope.cartData[order].quantity += 1;

  };
    $scope.showMap = function() {
      var mapPopup = $ionicPopup.confirm({
        title: 'Choose Location',
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
      var menu = $scope.cartData.indexOf(orderMenu);
      var menuId = Cart.menuId($scope.totalPrice, "id", orderMenu.id)

      if ($scope.cartData[menu].quantity > 0) {
        $scope.cartData[menu].quantity -= 1;
        if ($scope.cartData[menu].quantity <= 0) {
          $scope.cartData.splice(menu, 1);
          $scope.totalPrice.splice(menuId, 1);
        }
      }
    };

    $scope.delete = function(orderMenu) {
      var menu = $scope.cartData.indexOf(orderMenu);
      var menuId = Cart.menuId($scope.totalPrice, "id", orderMenu.id)

      var deletePopup = $ionicPopup.confirm({
        title: 'Delete order?',
        template: 'Are you sure you want to delete?',
        cssClass: 'delete-popup',
        scope: $scope
      });
      deletePopup.then(function(res) {
        if (res) {
          $scope.cartData.splice(menu, 1);
          $scope.totalPrice.splice(menuId, 1)
        }
      });

    };

    $scope.$watch('cartData', function(newArray) {
      $scope.menus = newArray.map(function(menu) {
        if (Cart.menuId($scope.totalPrice, "id", menu.id) === null) {
          $scope.totalPrice.push({
            id: menu.id,
            price: menu.price * menu.quantity
          });
        } else {
          var menuid = Cart.menuId($scope.totalPrice, "id", menu.id)
          $scope.totalPrice[menuid].price = menu.price * menu.quantity
        }
        return {
          menu: menu,
          subtotal: menu.price * menu.quantity
        }
      })
    }, true);

    // $scope.$watch('data.orderVal.pickupTime', function(newValue){
    //   console.log("NEW VALUE OKAY++ "+newValue);
    //   $scope.data.orderVal.pickupTime = newValue.getTime();
    // })


    $scope.$watch('totalPrice', function(newValue) {
      var price = 0;
      for (var i = 0; i < newValue.length; i++) {
        price += newValue[i].price;
      }
      $scope.total = price;
    }, true);


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

    $scope.buy = function(cart, location) {
      if (location) {
        $scope.order.$add({
          restaurant_id: $scope.restaurantId,
          customer_id: User.auth().$id,
          order_details: {
            location: location,
            latitude: $scope.marker.coords.latitude,
            longitude: $scope.marker.coords.longitude,
            menus: scanCart(cart),
            totalprice: $scope.total,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: 'pending',
          },
          orderStatus: {
            cancelled: false,
            confirmed: false
              // done : false,
              // onDelivery : false,
              // delivered : false
          },
        }).then(function() {
          CartData.get().length = 0;
          CartData.totalPrice().length = 0;
          var restaurant_owner = Restaurant.getOwner($scope.restaurantId);
          Database.notifications().$add({
            sender_id: User.auth().$id,
            receiver_id: restaurant_owner.$id,
            restaurant_id: $scope.restaurantId,
            type: 'order',
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
          $scope.restaurantCart.hide();
          alert("success")
        }).catch(function(error) {
          alert(error);
          console.log(error);
        });
      } else {
        alert("please fill up Location");
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
      $scope.marker = {
        id: Date.now(),
        coords: {
          latitude: $scope.currentLocation.latitude,
          longitude: $scope.currentLocation.longitude
        }
      };
      $scope.map.center = {
        latitude: $scope.currentLocation.latitude,
        longitude: $scope.currentLocation.longitude
      };
      $scope.placeName($scope.marker.coords.latitude, $scope.marker.coords.longitude);
    }

    //function that converts LatLng coordinates to word
    $scope.placeName = function(latitude, longitude) {
      var geocoder = new google.maps.Geocoder;
      var latLng = {
        lat: latitude,
        lng: longitude
      };
      geocoder.geocode({
        'location': latLng
      }, function(results, status) {
        if (status === 'OK') {
          $scope.$parent.location = results[0].formatted_address;
          $scope.$apply();
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      });
    }

  }
]);
