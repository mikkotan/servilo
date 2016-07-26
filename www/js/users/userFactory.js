app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  return {
    auth : function(){
      let authUser = firebase.database().ref().child('users').child(firebase.auth().currentUser.uid);
      return $firebaseObject(authUser);
    },
    all : function(){
      let users = firebase.database().ref().child("users")
      return $firebaseArray(users)
    }

  }
}])
