app.controller("OrderCtrl",["$scope","restaurants","Order",
  function($scope ,restaurants,Order){


    $scope.order = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Order.getOrder(restaurant.$id)
      }
    });


}]);
