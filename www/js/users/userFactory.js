
app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory){

  var users = firebase.database().ref().child("users")
  var conRef = firebase.database().ref(".info/connected");

  return {
    auth : function(){
      return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      return $firebaseArray(users);
    },
    authFullName : function(){
      return new UserFactory.object(users.child(firebase.auth().currentUser.uid))
    },
    register : function(userId){
      return $firebaseArray(users.child(userId));
    },
    setOnline : function(){
      var online = users.child(firebase.auth().currentUser.uid +'/online');
      conRef.on('value', function(data){
        if(data.val() === true){
          var con  = online.push(true);
          con.onDisconnect().remove();
        }
      })


    }

  };
}]);
