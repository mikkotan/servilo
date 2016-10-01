app.controller("OrderCtrl",["$scope","restaurants","Order","User","Menu",
  function($scope ,restaurants,Order,User,Menu){

    $scope.order = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Order.getOrder(restaurant.$id)
      }
    });

    $scope.customer_name = User.getUserFullname;
    $scope.orderMenu = Menu.get;
    console.log($scope.order);

}]);
