app.factory("Restaurant",["$firebaseAuth","$firebaseArray","$firebaseObject", "User", "MenusWithAvg", "Database",
  function($firebaseAuth , $firebaseArray , $firebaseObject, User, MenusWithAvg, Database){

  var authUserId = User.auth().$id;

  var restaurants = Database.restaurantsReference();
  var pendingRestaurants = Database.pendingsReference();
  var users = Database.usersReference();
  var menus = Database.menusReference();

  var pendingRestaurantsArray = Database.pendings();
  var restaurantsArray = Database.restaurants();
  var usersArray = Database.users();


  return {
    all : function() {
        return restaurantsArray;
    },
    getAuthUserRestaurants : function() {
        return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(authUserId))
    },
    get : function(restaurantId) {
        return restaurantsArray.$getRecord(restaurantId);
    },
    getPendingRestaurants : function() {
        return pendingRestaurantsArray;
    },
    getAveragePrice : function(restaurantId) {
      var res = restaurantsArray.$getRecord(restaurantId);
      return res.secured_data.avgPrice.toFixed(2);
    },
    getAverageRating : function(restaurantId) {
      var res = restaurantsArray.$getRecord(restaurantId);
      return res.secured_data.avgRate.toFixed(1);
    },
    getMenus : function(restaurantId) {
      return $firebaseArray(menus.orderByChild("restaurant_id").equalTo(restaurantId));
    },
    getRestaurantStatus : function(ownerId) {
      if(usersArray.$getRecord(ownerId).online != null){
        return "Online"
      }
      else{
        return "Offline"
      }
    },
    getRestaurant : function(restaurantId){
      return $firebaseArray(restaurants.child(restaurantId));
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
