app.controller('PendingCtrl',["$scope","Auth","Restaurant",function($scope ,Auth,Restaurant){

  console.log("PendingCtrl");
  $scope.approveRestaurant = function(restaurant) {
    $scope.pendingRestaurants.$remove(restaurant)
      .then(() => {
        var add = Restaurant.addRestaurant(restaurant);
        add.ref
          .then(() => {
            Restaurant.getTimestamp(add.key).transaction(function(currentTimestamp) {
              return firebase.database.ServerValue.TIMESTAMP;
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

      $scope.pendingRestaurants = Restaurant.getPendingRestaurants();

}])
