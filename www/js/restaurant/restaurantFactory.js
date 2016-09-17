app.factory("Restaurant",["$firebaseAuth","$firebaseArray","$firebaseObject", "User", "MenusWithAvg",
  function($firebaseAuth , $firebaseArray , $firebaseObject, User, MenusWithAvg){
  var rootRef = firebase.database().ref();
  var authUserId = User.auth().$id;
  var restaurants = rootRef.child("restaurants");
  var pendingRestaurants = rootRef.child("pending");
  var restaurantsArray = $firebaseArray(restaurants);
  var users = rootRef.child("users");
  var userRestaurantsChildArray = $firebaseArray(rootRef.child('users').child(authUserId).child('restaurants'));
  var usersArray = $firebaseArray(users);

  return {
    all : function(){
        return $firebaseArray(restaurants);
    },
    getAuthUserRestaurants : function(){
        return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(authUserId))
    },
    get : function(restaurantId){
        return $firebaseObject(restaurants.child(restaurantId));
    },
    getPendingRestaurants : function() {
        return $firebaseArray(pendingRestaurants);
    },
    getUserRestaurantChild : function() {
      return userRestaurantsChildArray;
    },

    getAveragePrice : function(restaurantId) {
      var res = restaurantsArray.$getRecord(restaurantId);
      // var avg = res.secured_data.sumPrice / res.secured_data.totalMenuCount;
      return res.secured_data.avgPrice.toFixed(2);
    },
    getAverageRating : function(restaurantId) {
      var res = restaurantsArray.$getRecord(restaurantId);
      return res.secured_data.avgRate.toFixed(1);
    },

    getRestaurantStatus : function(ownerId) {
      if(usersArray.$getRecord(ownerId).online != null){
        return "Online"
      }
      else{
        return "Offline"
      }
    },
    getRestaurantOpenStatus : function(restaurantId) {
      var restaurant = restaurantsArray.$getRecord(restaurantId);
      var restaurantOpenTime = new Date(restaurant.openTime);
      var restaurantCloseTime = new Date(restaurant.closeTime);
      var openTime = new Date();
      var closeTime = new Date();
      var now = new Date();

      openTime.setHours(restaurantOpenTime.getHours(), restaurantOpenTime.getMinutes());
      closeTime.setHours(restaurantCloseTime.getHours(), restaurantCloseTime.getMinutes());

      if(restaurantOpenTime.getTime() > restaurantCloseTime.getTime()) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      if(openTime.getTime() < now.getTime() && now.getTime() < closeTime.getTime()) {
        return "Open";
      }
      else{
        return "Closed"
      }
    }
  }
}]);
