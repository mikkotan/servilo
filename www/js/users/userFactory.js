app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){

  let users = firebase.database().ref().child("users")

  return {
    auth : function(){
      let authUser = firebase.database().ref().child('users');
      return $firebaseObject(authUser.child(firebase.auth().currentUser.uid));
    },
    all : function(){

      return $firebaseArray(users)
    }

  }
}])
