app.controller("ViewRestaurantMenus", ["$scope", "$state", "restaurantMenus", "restaurantId", "CartData", "$ionicModal", "Cart", "Restaurant", "ionicToast",
  function($scope, $state, restaurantMenus, restaurantId, CartData, $ionicModal, Cart, Restaurant, ionicToast) {

    $scope.restaurantId = restaurantId
    $scope.restaurantMenus = restaurantMenus;
    var restaurant = Restaurant.get(restaurantId);

    restaurant.$loaded()
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
      console.log(menu.photoURL);
      if ($scope.getRestaurantStatus) {
        $scope.id = menu.$id;
        $scope.menuName = menu.name;
        $scope.menuPrice = menu.price;
        $scope.menuPhoto = menu.photoURL;
        $scope.addToCartModal.show();
      } else {
        alert('sorry the restaurant is offline')
      }
      console.log('Scope photo: ' + $scope.menuPhoto);
    };

    $scope.viewCart = function() {
      if (!CartData.isEmpty()) {
        $scope.restaurantCart.show();
        console.log(JSON.stringify(CartData.get().menus, null, 4));
      } else {
        alert("No food in your cart");
      }
    }

    // $scope.back = function() {
    //   if (!CartData.isEmpty()) {
    //     let confirmation = confirm("Leaving this restaurant will cancel all your orders, Are you sure you want to leave?")
    //     if (confirmation === true) {
    //       CartData.setNull()
    //       $state.go("tabs.home");
    //     }
    //   } else {
    //     $state.go("tabs.home");
    //   }
    // }


    var closeModal = function() {
      $state.go("tabs.viewRestaurant.menus");
      $scope.addToCartModal.hide();
    }

    $scope.sendToCart = function(menu) {

      let menuOrder = Cart.menuId(CartData.get().menus, "id", $scope.id);

      if (menu.quantity) {
        if (menu.quantity > 0) {
          let menuCart = {
              id: $scope.id,
              name: $scope.menuName,
              price: $scope.menuPrice,
              photoURL: $scope.menuPhoto,
              quantity: menu.quantity
          };
          console.log(menuCart)
          $scope.error = false;

          if (menuOrder === null) {
            CartData.addMenu(menuCart);
            console.log(CartData.get().menus)
            ionicToast.show('Added ' + $scope.menuName + ' to cart', 'bottom', false, 2500);
            closeModal();
            menu.quantity = 0;
          } else {
            var cartMenu = CartData.get().menus[menuOrder];
            cartMenu.quantity = cartMenu.quantity + menu.quantity;
            ionicToast.show('Added ' + $scope.menuName + ' to cart', 'bottom', false, 2500);
            closeModal();
            menu.quantity = 0;
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
