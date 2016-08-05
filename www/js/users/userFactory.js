
app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory){

  var users = firebase.database().ref().child("users")

  return {
    auth : function(){
      return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      return UserFactory.array(users);
    },
    authFullName : function(){
      return new UserFactory.object(users.child(firebase.auth().currentUser.uid))

    }
  }
}])
