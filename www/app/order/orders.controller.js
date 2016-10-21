app.controller("OrderCtrl",["$scope","restaurants","Restaurant","User","Menu", "Database",
  function($scope ,restaurants, Restaurant, User, Menu, Database){

    $scope.restaurants = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Restaurant.getOrders(restaurant.$id)
      }
    });

    $scope.customer_name = User.getUserFullname;
    $scope.orderMenu = Menu.get;

    $scope.changeOrderStatus = function(orderId, key, val) {
      console.log('toggled');
      console.log('Order ID ' + orderId)
      console.log('Key : ' + key + '\nVal : ' + val)
      var orderRef = Database.ordersReference().child(orderId).child('orderStatus').child(key).set(val);
      if (val === true) {
        Database.ordersReference().child(orderId).child('status').set(key);
      }

      console.log('Order Reference :' + orderRef);
    }
}]);
