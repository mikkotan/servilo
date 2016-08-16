app.factory("Restaurant",["$firebaseAuth","$firebaseArray","$firebaseObject", "User",
  function($firebaseAuth , $firebaseArray , $firebaseObject, User){

    var restaurants = firebase.database().ref().child("restaurants");
    var restaurantsArray = $firebaseArray(restaurants);
    var pendingRestaurants = firebase.database().ref().child("pending");
    return {
      all : function(){
          return $firebaseArray(restaurants);
      },
      getAuthUserRestaurants : function(){
          return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(User.auth().$id))
      },
      get : function(restaurantId){
          return $firebaseObject(restaurants.child(restaurantId));
      },
      getPendingRestaurants : function() {
          return $firebaseArray(pendingRestaurants);
      },
      getAveragePrice : function(restaurantId) {
        var res = restaurantsArray.$getRecord(restaurantId);
        var avg = res.sumPrice / res.totalMenuCount;
        return avg.toFixed(2);
      },
      getAverageRating : function(restaurantId) {
        var res = restaurantsArray.$getRecord(restaurantId);
        // var avg = res.sumRating / res.totalRatingCount;
        // return avg.toFixed(1);
        return res.avgRate.toFixed(1);
      }
      // getAveragePrice : function(restaurantId) {
      //   var menus = $firebaseArray(firebase.database().ref().child("menus").orderByChild("restaurant_id").equalTo(restaurantId));
      //   var sumPrice = 0;
      //   var count = 0;
      //
      //   menus.$loaded().then(function(menus){
      //     menus.forEach(function(menu){
      //       sumPrice += menu.price;
      //       count++;
      //     })
      //     return sumPrice/count;
      //   })
      //   .catch(function(error){
      //     console.log("ERROR HERE"+ error);
      //   })
      //
      //
      // }
    }

}]);
