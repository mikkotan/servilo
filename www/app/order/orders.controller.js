app.controller("OrderCtrl",["$scope","restaurants","Restaurant","User","Menu", "Database", "Order", "$ionicPopup",
  function($scope, restaurants, Restaurant, User, Menu, Database, Order, $ionicPopup){

    $scope.restaurants = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Restaurant.getOrders(restaurant.$id)
      }
    });

    $scope.customer_name = User.getUserFullname;
    $scope.orderMenu = Menu.get;

    $scope.changeOrderStatus = function(orderId, key, val) {
      return Order.updateStatus(orderId, key, val);
    }
}]);
