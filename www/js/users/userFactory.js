app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory){
  var rootRef = firebase.database().ref();
  var users = rootRef.child("users")
  var conRef = rootRef.child(".info/connected");

  return {
    auth : function(){
      return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      return $firebaseArray(users);
    },
    authFullName : function(){
      var name = new UserFactory.object(users.child(firebase.auth().currentUser.uid));
      name.$loaded().then(function() {
        console.log(name.getFullName());
        return name.getFullName()
      }).catch(function(){
        return "wait"
      })

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
