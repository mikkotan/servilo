app.factory("Home",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "Database",
  function($firebaseObject ,$firebaseAuth, $firebaseArray, Database){
  var rootRef = firebase.database().ref();

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
  }
}])
