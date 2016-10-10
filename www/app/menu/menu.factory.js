app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject","Restaurant", "Database",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Restaurant, Database){

  var rootRef = firebase.database().ref();
  var menus = Database.menusReference();
  var restaurants = Database.restaurantsReference();
  var menusArray = Database.menus();
  var restaurantsArray = Database.restaurants();

  return {
    all : function() {
      return menusArray;
    },
    get : function(menuId) {
      return menusArray.$getRecord(menuId);
    },
    getRestaurant : function(menu){
      return restaurantsArray.$getRecord(menu.restaurant_id);
    },
    getRestaurantMenus : function(restaurantId){
      return $firebaseArray(menus.orderByChild("restaurant_id").equalTo(restaurantId))
    }
  }
}]);
