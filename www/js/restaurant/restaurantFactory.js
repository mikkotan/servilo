app.factory("Restaurant",["$firebaseAuth","$firebaseArray","$firebaseObject", "User", "MenusWithAvg",
  function($firebaseAuth , $firebaseArray , $firebaseObject, User, MenusWithAvg){

    var restaurants = firebase.database().ref().child("restaurants");
    var restaurantsArray = $firebaseArray(restaurants);
    var pendingRestaurants = firebase.database().ref().child("pending");
    var userRestaurantsChildArray = $firebaseArray(firebase.database().ref().child('users').child(User.auth().$id).child('restaurants'));

    var users = firebase.database().ref().child("users");
    var usersArray = $firebaseArray(users);

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
      getUserRestaurantChild : function() {
        return userRestaurantsChildArray;
      },
      getAveragePrice : function(restaurantId) {
        var res = restaurantsArray.$getRecord(restaurantId);
        var avg = res.sumPrice / res.totalMenuCount;
        return avg.toFixed(2);
        // var menus = firebase.database().ref().child("menus").orderByChild("restaurant_id").equalTo(restaurantId);
        // var menuAvg = new MenusWithAvg(menus);
        // menuAvg.$loaded().then(function(){
        //   console.log("menu avg is "+menuAvg.avg());
        // })
        // return "hello";
      },
      getAverageRating : function(restaurantId) {
        var res = restaurantsArray.$getRecord(restaurantId);

        return res.avgRate.toFixed(1);
      },
      getRestaurantStatus : function(ownerId){
          if(usersArray.$getRecord(ownerId).online != null){
            return "Online"
          }
          else{
            return "Offline"
          }
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
      //
      //
      // }
    }

}]);
