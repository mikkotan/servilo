app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  var rootRef = firebase.database().ref(); 
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
    }
  }
}])
