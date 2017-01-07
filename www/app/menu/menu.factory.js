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
      return $firebaseObject(menus.child(menuId))
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
    },
    getMenusFromCategories : function(restaurantId, categoryId) {
      return $firebaseArray(restaurants.child(restaurantId).child('menu_categories').child(categoryId).child('menus'))
    },
    create : function(menu) {
      var authObj = firebase.auth().currentUser.uid;
      var pushId = Database.menusReference().push();
      return pushId.set(menu)
        .then(() => {
          Database.restaurantMenusReference().child(menu.restaurant_id).child(pushId.key).set(true)
            .then(() => {
              return Database.restaurantsReference().child(menu.restaurant_id).child('menu_categories').child(menu.category_id).child('menus').child(pushId.key).set(true)
            })
        })
    },
    delete : function(menuId) {
      return Database.menusReference().child(menuId).once('value')
        .then((menuSnapshot) => {
          var menuId = menuSnapshot.key
          var restaurant_id = menuSnapshot.val().restaurant_id
          var category_id = menuSnapshot.val().category_id
          Database.menusReference().child(menuId).remove()
            .then(() => {
              Database.restaurantMenusReference().child(restaurant_id).child(menuId).remove()
                .then(() => {
                  return Database.restaurantsReference().child(restaurant_id).child(category_id).child('menus').child(menuId).remove()
                })
            })
        })
    },
    update : function(menu) {
      return Database.menusReference().child(menu.$id).update({
        name: menu.name,
        price: menu.price,
        category_id: menu.category
      })
    },
    changeAvailability : function(menu) {
      return Database.menusReference().child(menu.$id).update({
        availability: menu.availability,
      })
    },

  }
}]);
