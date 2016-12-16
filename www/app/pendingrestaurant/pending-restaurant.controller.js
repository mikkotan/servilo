app.controller('PendingCtrl',["$scope","Auth","Restaurant",'User','Notification',
function($scope ,Auth,Restaurant,User, Notification){

  console.log("PendingCtrl");
  var roleIsUser = false;
  $scope.pendingRestaurants = Restaurant.getPendingRestaurants();
  console.log($scope.pendingRestaurants);



  $scope.approveRestaurant = function(restaurant) {
    User.isUser(restaurant.owner_id).then((val) => {
      restaurant.owner_role_is_user   =  val
        $scope.pendingRestaurants.$remove(restaurant)
          .then(() => {
            var add = Restaurant.addRestaurant(restaurant);
            console.log(add.key);
            add.ref
              .then(() => {
                Notification.create({
                  sender_id:Auth.$getAuth().uid,
                  receiver_id:restaurant.owner_id,
                  type:'approve',
                  timestamp: firebase.database.ServerValue.TIMESTAMP,
                  restaurant_id: add.key,
                  isRestaurantOwner:!restaurant.owner_role_is_user
                }).then(()=>{
                  console.log("success notification sent");
                  if(restaurant.owner_role_is_user){
                    User.removeFromUser(restaurant.owner_id)
                    User.setAsRestaurantOwner(restaurant.owner_id)
                  }
                })
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
    })
  }



}])
