app.factory("Search",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "Database",
  function($firebaseObject ,$firebaseAuth, $firebaseArray, Database){
  var rootRef = firebase.database().ref();

  // var menus = rootRef.child("menus");
  var menusRef = Database.menusReference();

  // var restaurant = rootRef.child('restaurants');
  var restaurantRef = Database.restaurantsReference();
  // var usersRef = rootRef.child('users');
  var usersRef = Database.usersReference();
  var usersObj = $firebaseArray(usersRef);

  return {
    restaurants : function(){
      return $firebaseArray(restaurant);
    },
    getRestaurant : function(restaurantId){
      return $firebaseObject(restaurant.child(restaurantId));
    },
    getUserName : function(uid){
      return usersObj.$getRecord(uid).firstName + " " + usersObj.$getRecord(uid).lastName;
    },
    //redundant to menusfactory
    getRestaurantMenus : function(restaurantId){
      return $firebaseArray(menusRef.orderByChild("restaurant_id").equalTo(restaurantId))
    }
  }
}])
