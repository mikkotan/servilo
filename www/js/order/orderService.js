app.factory("Order",["$firebaseAuth","$firebaseArray","$firebaseObject",
  function($firebaseAuth , $firebaseArray , $firebaseObject){

  var rootRef = firebase.database().ref();

  var order = rootRef.child("order");

  // var restaurants = rootRef.child("restaurants");
  // var restaurantsArray = $firebaseArray(restaurants);

  return {
    all : function() {
      return $firebaseArray(order);
    }
  }
}]);
