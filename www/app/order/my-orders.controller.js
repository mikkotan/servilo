app.controller("MyOrdersCtrl",["$scope","orders", "Database", "$ionicPopup",
  function($scope, orders, Database, $ionicPopup) {

    $scope.orders = orders;

    $scope.cancel = function(order) {
      var confirm = $ionicPopup.confirm({
        title: 'Cancel Order',
        template: 'Cancel your Order #' + order.order_details.timestamp + '?',
      })
      .then((res) => {
        if (res) {
          var orderRef = Database.ordersReference().child(order.$id);
          orderRef.child('order_details').child('status').set('cancelled');
          orderRef.child('orderStatus').set(null);
        }
        else {
          console.log('Cancel failed');
        }
      })


    }
  }]);
