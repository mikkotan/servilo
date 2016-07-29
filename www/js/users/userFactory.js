app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  return {
    auth : function(){
      var authUser = firebase.database().ref().child('users').child(firebase.auth().currentUser.uid);
      return $firebaseObject(authUser);
    },
    all : function(){
      var users = firebase.database().ref().child("users")
      return $firebaseArray(users)
    }

  }
}])
