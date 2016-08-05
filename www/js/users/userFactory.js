app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  return {
    auth : function(){
      var authUser = firebase.database().ref().child('users');
      return $firebaseObject(authUser.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      let users = firebase.database().ref().child("users")
      return $firebaseArray(users)
    }
  }
}])
