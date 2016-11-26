app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "Database",
  function($firebaseObject ,$firebaseAuth, $firebaseArray, Database){
  var rootRef = firebase.database().ref();
  var restaurants = [];
  var restaurantsRef = Database.restaurantsReference();

  return {
    nextRestaurants : function(key) {
      var query = restaurantsRef.orderByKey().startAt(key+1).limitToFirst(5);
      return $firebaseArray(query);
    },
    srestaurants : function() {
      var query = restaurantsRef.orderByKey().limitToFirst(10);
      return $firebaseArray(query);
    },
    getLastKey : function(restaurantArray) {
      return restaurantArray[restaurantArray.length-1].$id;
    },
    // restaurants : function() {
    //   var query = restaurantsRef.orderByKey().limitToFirst(10);
    //   return $firebaseArray(query).$loaded().then(function(data) {
    //     this.restaurants = data;
    //   })
    // }
    search : function(input) {
      var end = input.substring(0, 1);
      var query = restaurantsRef.orderByChild('name').startAt(input).endAt(end + "\uf8ff");
      // return query;
      return $firebaseArray(query);
    }
  }

}])
