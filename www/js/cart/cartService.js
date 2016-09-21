app.factory("Cart",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

    var rootRef = firebase.database().ref();
    var orders = rootRef.child("order");

  return {
    order : function(){
      return $firebaseArray(orders);
    }
  }
}])
