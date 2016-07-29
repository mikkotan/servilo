app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  var users = firebase.database().ref().child("users")

  return {
    auth : function(){
      return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      return $firebaseArray(users)
    }

  }
}])
