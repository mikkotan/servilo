app.controller("MyOrdersCtrl",["$scope","orders", "Database",
  function($scope, orders, Database){

    $scope.orders = orders;

    $scope.cancel = function(order) {
      var orderRef = Database.ordersReference().child(order.$id);
      orderRef.child('order_details').child('status').set('cancelled');
      orderRef.child('orderStatus').set(null);
    }
  }]);
