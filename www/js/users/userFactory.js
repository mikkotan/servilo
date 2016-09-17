app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory){
  var rootRef = firebase.database().ref();
  var users = rootRef.child("users")
  var usersObj = $firebaseArray(users);

  return {
    auth : function(){
        return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function(){
      return $firebaseArray(users);
    },
    getAuthFullName : function(){
      var authId = firebase.auth().currentUser.uid;
      console.log(usersObj.$getRecord(authId).firstName);
      return usersObj.$getRecord(authId).firstName + " " + usersObj.$getRecord(authId).lastName;
    },
    register : function(userId){
      return $firebaseArray(users.child(userId));
    },
    setOnline : function(){
      var conRef = rootRef.child(".info/connected");
      var online = users.child(firebase.auth().currentUser.uid +'/online');
      conRef.on('value', function(data){
        if(data.val() === true){
          var con  = online.push(true);
          con.onDisconnect().remove();
        }
      })
    },
    setO : function() {
      var usersRef = new Firebase(FirebaseUrl+'users');
      var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
      var connected = $firebaseObject(connectedRef);
      var online = $firebaseArray(usersRef.child(uid+'/online'));

      connected.$watch(function(){
        if(connected.$value == true){
          onlin.$add(true).then(function(){

          })
        }
      })
    }
  };
}]);
