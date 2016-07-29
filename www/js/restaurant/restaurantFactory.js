app.factory("Restaurant",["$firebaseAuth","$firebaseArray","$firebaseObject", "User",
  function($firebaseAuth , $firebaseArray , $firebaseObject, User){

    var restaurants = firebase.database().ref().child("restaurants");

    return {
      all : function(){
          return $firebaseArray(restaurants);
      },
      getAuthUserRestaurants : function(){
          return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(User.auth().$id))
      },
      get : function(restaurantId){
        return $firebaseObject(restaurants.child(restaurantId));
      }
    }

}]);
