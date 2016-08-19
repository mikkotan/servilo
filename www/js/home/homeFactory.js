app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  var restaurant = firebase.database().ref().child('restaurants');
  var usersRef = firebase.database().ref().child('users');
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
