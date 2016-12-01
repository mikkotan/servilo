app.controller("ViewRestaurantMenus", ["$scope", "$state", "restaurantMenus", "restaurantId", "CartData", "$ionicModal", "Cart", "Restaurant", "$ionicToast",
  function($scope, $state, restaurantMenus, restaurantId, CartData, $ionicModal, Cart, Restaurant, $ionicToast) {

    $scope.restaurantId = restaurantId
    $scope.restaurantMenus = restaurantMenus;
    var restaurant = Restaurant.get(restaurantId);

    restaurant
      .then(function() {
        var restaurantStatus = Restaurant.getRestaurantStatus(restaurant.owner_id);
        restaurantStatus.on('value', function(snap) {
          $scope.getRestaurantStatus = snap.val();
          $scope.status = restaurant.name + " is " + (snap.val() ? "Online" : "Offline");
        })
      })


    $scope.availability = function(menu) {
      return menu.availability ? "Available" : "Currently not available"
    }


    $scope.addToCart = function(menu) {
      if ($scope.getRestaurantStatus) {
        $scope.id = menu.$id;
        $scope.menuName = menu.name;
        $scope.menuPrice = menu.price;
        $scope.addToCartModal.show();
      } else {
        alert('sorry the restaurant is offline')
      }
    };

    $scope.viewCart = function() {
      if (CartData.get().length > 0) {
        $scope.restaurantCart.show();
      } else {
        alert("No food in your cart");
      }
    }

    $scope.back = function() {
      if (CartData.get().length > 0) {
        let confirmation = confirm("Leaving this restaurant will cancel all your orders, Are you sure you want to leave?")
        if (confirmation === true) {
          CartData.get().length = 0;
          CartData.totalPrice().length = 0;
          $state.go("tabs.home");
        }
      } else {
        $state.go("tabs.home");
      }
    }


    var closeModal = function() {
      $state.go("tabs.viewRestaurant.menus");
      $scope.addToCartModal.hide();
    }

    $scope.sendToCart = function(menu) {

      let menuOrder = Cart.menuId(CartData.get(), "id", $scope.id);

      if (menu.quantity) {
        if (menu.quantity > 0) {
          let menuCart = {
            id: $scope.id,
            name: $scope.menuName,
            price: $scope.menuPrice,
            quantity: menu.quantity
          };
          $scope.error = false;

          if (menuOrder === null) {
            CartData.add(menuCart);
            ionicToast.show('Added ' + $scope.menuName + ' to cart', 'bottom', false, 2500);
            closeModal();
          } else {
            var cartMenu = CartData.get()[menuOrder];
            cartMenu.quantity = cartMenu.quantity + menu.quantity;
            ionicToast.show('Added ' + $scope.menuName + ' to cart', 'bottom', false, 2500);
            closeModal();
          }
        } else {
          $scope.error = true;
          console.log("error : " + $scope.error)
          $scope.errorMessage = "Invalid Input "
        }

      } else {
        $scope.error = true;
        console.log("error : " + $scope.error)
        ionicToast.show('Quantity is undefined.', 'bottom', false, 2500);
        $scope.errorMessage = "Quantity is undefined"
      }

    }

    $ionicModal.fromTemplateUrl('app/menu/_add-cart-modal.html', function(addToCartModal) {
      $scope.addToCartModal = addToCartModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/cart/_cart.html', function(restaurantCart) {
      $scope.restaurantCart = restaurantCart;
    }, {
      scope: $scope
    });




  }
]);
