app.factory("Order",["$firebaseAuth","$firebaseArray","$firebaseObject", "Database",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Database){

  var rootRef = firebase.database().ref();

  // var orders = rootRef.child("orders");
  // var restaurant = rootRef.child("restaurants")
  var orders = Database.ordersReference();
  var restaurant = Database.restaurantsReference();


  return {
    all : function() {
      return $firebaseArray(orders);
    },
    getOrder : function(restaurantId){
      return $firebaseArray(orders.orderByChild("restaurant_id").equalTo(restaurantId));
    }
  }
}]);
