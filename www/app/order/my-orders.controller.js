app.controller("MyOrdersCtrl",["$scope","orders", "Database", "$ionicPopup", "Order",
  function($scope, orders, Database, $ionicPopup, Order) {

    $scope.orders = orders;

    $scope.cancel = function(order) {
      console.log('cancel clicked');
      return Order.cancel(order)
    }
  }]);
