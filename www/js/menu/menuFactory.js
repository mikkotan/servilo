app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject","Restaurant",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Restaurant){

    var menus = firebase.database().ref().child("menus");
    var restaurants = firebase.database().ref().child("restaurants");
    var restaurantsArray = $firebaseArray(restaurants);

    return {
      all : function() {
        return $firebaseArray(menus);
      },
      get : function(menuId) {
        return $firebaseObject(menus.child(menuId))
      },
      getRestaurant : function(restaurantId){
        return restaurantsArray.$getRecord(restaurantId).name;
      },
      getRestaurantMenus : function(restaurantId){
        return $firebaseArray(menus.orderByChild("restaurant_id").equalTo(restaurantId))
      }
    }
}]);
