app.controller("AddReservationCtrl", ["$scope", "restaurant", "Restaurant",
  function($scope, restaurant, Restaurant){
    console.log("Add Reservation Ctrl fired");
    $scope.sample = "For Reservation Only";
    $scope.restaurant = Restaurant.get(restaurant);
    console.log(restaurant);
  }]);
