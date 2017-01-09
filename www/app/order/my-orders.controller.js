app.controller("MyOrdersCtrl", ["$scope", "orders", "Database", "$ionicPopup", "Order","Restaurant",
  function($scope, orders, Database, $ionicPopup, Order, Restaurant) {

    $scope.orders = orders;
    // console.error(orders);

    $scope.$watchCollection('orders', function(watchedOrders) {
      $scope.newOrders = watchedOrders.map(function(order) {
        var o = {
          get: Restaurant.get(order.restaurant_id).$loaded()
            .then((restaurant) => {
              o.restaurant_name = restaurant.name
              o.details = order
            })
        }
        return o;
      })
    })

    $scope.cancel = function(order) {
      console.log('cancel clicked');
      return Order.cancel(order)
    }
  }
]);
