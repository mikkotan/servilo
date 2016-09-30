app.controller("OrderCtrl",["$scope","restaurants","Order","User","Menu",
  function($scope ,restaurants,Order,User,Menu){

    $scope.order = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,

      }
    });

    $scope.customer_name = User.getUserFullname
    console.log($scope.order);
}]);
