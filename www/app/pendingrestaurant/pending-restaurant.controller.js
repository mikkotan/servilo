app.controller('PendingCtrl',["$scope","Auth","Restaurant",'User',function($scope ,Auth,Restaurant,User){

  console.log("PendingCtrl");
  $scope.pendingRestaurants = Restaurant.getPendingRestaurants();

  $scope.approveRestaurant = function(restaurant) {

    $scope.pendingRestaurants.$remove(restaurant)
      .then(() => {
        User.removeFromUser(restaurant.owner_id)
        User.setAsRestaurantOwner(restaurant.owner_id)
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



}])
