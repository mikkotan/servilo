app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject","Restaurant", "Database",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Restaurant, Database){

  var rootRef = firebase.database().ref();
  var menus = Database.menusReference();
  var restaurants = Database.restaurantsReference();
  // var menusArray = Database.menus();
  // var restaurantsArray = Database.restaurants();

  return {
    all : function() {
      return menusArray;
    },
    menusRef : function(pushKey) {
      // var pushKey = menus.push().key;
      return menus.child(pushKey);
    },
    generateKey : function() {
      return menus.push().key;
    },
    get : function(menuId) {
      return menusArray.$getRecord(menuId);
    },
    getRestaurantRef : function(restaurantId, categoryId, key){
      var restaurantRef = restaurants.child(restaurantId);
      restaurantRef.child('menus').child(key).set(true);
      restaurantRef.child('menu_categories').child(categoryId).child('menus').child(key).set(true);
    },
    getRestaurantMenus : function(restaurantId){
      return $firebaseArray(menus.orderByChild("restaurant_id").equalTo(restaurantId))
    },
    getMenuCategories : function(restaurantId) {
      return $firebaseArray(restaurants.child(restaurantId).child('menu_categories'));
    }
  }
}]);