app.factory("Restaurant",["$firebaseArray", "User", "Database", "$firebaseObject", "$q",
  function($firebaseArray, User, Database, $firebaseObject, $q){

  var restaurants = Database.restaurantsReference();
  // var pendingRestaurants = Database.pendingsReference(); //not used
  var users = Database.usersReference(); //not used
  // var menus = Database.menusReference();
  // var reviews = Database.reviewsReference();
  // var orders = Database.ordersReference();
  // var pendingRestaurantsArray = Database.pendings();
  var restaurantsArray = Database.restaurants();
  // var usersArray = Database.users();

  var Restaurant = {
    all : function() {
        return Database.restaurants();
    },
    getAuthUserRestaurants : function() {
      var authUserId = User.auth().$id;
      return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(authUserId))
    },
    get : function(restaurantId) {
      return Database.restaurantsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          console.log(snapshot.val());
          return snapshot.val();
        })
    },
    getPendingRestaurants : function() {
      return Database.pendings();
    },
    // getAveragePrice : function(restaurantId) {
    //   var res = Database.restaurants().$getRecord(restaurantId);
    //   return res.secured_data.avgPrice.toFixed(2);
    // },
    // getAverageRating : function(restaurantId) {
    //   var res = Database.restaurants().$getRecord(restaurantId);
    //   return res.secured_data.avgRate.toFixed(1);
    // },
    getMenus : function(restaurantId) {
      return $firebaseArray(Database.menusReference().orderByChild("restaurant_id").equalTo(restaurantId));
    },
    getRestaurantStatus : function(ownerId) {
      return Database.usersReference().child(ownerId).child("online");
    },
    getRestaurant : function(restaurantId) {
      return $firebaseArray(restaurants.child(restaurantId));
    },
    getRestaurantName : function(restaurantId) {
      return Database.restaurantsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          return snapshot.val().name
        })
    },
    getReviews : function(restaurantId) {
      return $firebaseArray(Database.reviewsReference().orderByChild('restaurant_id').equalTo(restaurantId));
    },
    getOwner : function(restaurantId) {
      // console.log('get owner method');
      console.log(restaurantId);
      var res = restaurantsArray.$getRecord(restaurantId);
      console.log(res);
      return $firebaseObject(users.child(res.owner_id))
    },
    getOrders : function(restaurantId) {
      return $firebaseArray(Database.ordersReference().orderByChild("restaurant_id").equalTo(restaurantId));
    },
    getRestaurantOpenStatus : function(restaurant) {
      // var restaurant = $firebaseObject(restaurants.child(restaurantId));
      // var restaurant = restaurants.$getRecord(restaurantId);
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
        return true;
      }
      else{
        return false;
      }
    }
  }

  return Restaurant;
}]);
