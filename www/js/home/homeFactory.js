app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  var rootRef = firebase.database().ref();

  var menus = rootRef.child("menus");

  var restaurant = rootRef.child('restaurants');
  var usersRef = rootRef.child('users');
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
      return $firebaseArray(menus1.orderByChild("restaurant_id").equalTo(restaurantId))
    }
  }
}])
