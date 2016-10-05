app.controller("OrderCtrl",["$scope","restaurants","Restaurant","User","Menu",
  function($scope ,restaurants,Restaurant,User,Menu){

    $scope.restaurants = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Restaurant.getOrders(restaurant.$id)
      }
    });

    $scope.customer_name = User.getUserFullname;
    $scope.orderMenu = Menu.get;

//     $scope.restaurants = restaurants.map(function(restaurant){
//         return Restaurant.getOrders(restaurant.$id).map(function(orders){
//           return orders
//         })
//     });
//     console.log($scope.restaurants);
}]);
