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
      var avg = res.sumPrice / res.totalMenuCount;
      return avg.toFixed(2);
    },
    getAverageRating : function(restaurantId) {
      var res = restaurantsArray.$getRecord(restaurantId);
      return res.avgRate.toFixed(1);
    },
    getRestaurantStatus : function(ownerId){
        if(usersArray.$getRecord(ownerId).online != null){
          return "Online"
        }
        else{
          return "Offline"
        }

    }
  }
}]);
