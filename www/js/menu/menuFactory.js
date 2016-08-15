app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject","Restaurant",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Restaurant){

    var menus = firebase.database().ref().child("menus");
    var restaurants = firebase.database().ref().child("restaurants");
    var restaurantsArray = $firebaseArray(restaurants);

    return {
      all : function() {
        console.log("ALL IS RUNNING++");
        return $firebaseArray(menus);
      },
      get : function(menuId) {
        console.log("get IS RUNNING++");
        return $firebaseObject(menus.child(menuId))
      },
      getRestaurant : function(restaurantId){
        console.log("GET RESTAURANT IS RUNNING++");
        console.log(restaurantsArray.$getRecord(restaurantId));
        // return $firebaseArray.$extend(Restaurant.get(restaurantId));
        return restaurantsArray.$getRecord(restaurantId).name;
      },
      getRestaurantMenus : function(restaurantId){
        return $firebaseArray(menus.orderByChild("restaurant_id").equalTo(restaurantId))
      }
    }
}]);
