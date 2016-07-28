app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  let restaurant = firebase.database().ref().child('restaurants');

  return {
    restaurants : function(){
      return $firebaseArray(restaurant);
    },
    restaurant : function(restaurantId){
      return $firebaseObject(restaurant.child(restaurantId));
    }

  }
}])
