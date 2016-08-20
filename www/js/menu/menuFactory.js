app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject","Restaurant",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Restaurant){
  var rootRef = firebase.database().ref();
  var menus = rootRef.child("menus");
  var restaurants = rootRef.child("restaurants");
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
