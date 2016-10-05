app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory", "Database",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory, Database){
  var rootRef = firebase.database().ref();
  var users = rootRef.child("users");
  var usersObj = $firebaseArray(users);
  var restaurantsRef = Database.restaurantsReference();
  var notificationsRef = Database.notificationsReference();

  return {
    auth : function() {
      return $firebaseObject(users.child(firebase.auth().currentUser.uid));
    },
    all : function() {
      return $firebaseArray(users);
    },
    getAuthRestaurants : function() {
      return $firebaseArray(restaurantsRef.orderByChild('owner_id').equalTo(firebase.auth().currentUser.uid));
    },
    getAuthFullName : function() {
      var authId = firebase.auth().currentUser.uid;
      return usersObj.$getRecord(authId).firstName + " " + usersObj.$getRecord(authId).lastName;
    },
    getAuthNotifications : function() {
      return $firebaseArray(notificationsRef.orderByChild('receiver_id').equalTo(firebase.auth().currentUser.uid));
    },
    getUserFullname : function(id){
      return  usersObj.$getRecord(id).firstName + " " + usersObj.$getRecord(id).lastName;
    },
    register : function(userId){
      return $firebaseArray(users.child(userId));
    },
    setOnline : function() {
      var conRef = rootRef.child(".info/connected");
      var online = users.child(firebase.auth().currentUser.uid +'/online');
      conRef.on('value', function(data) {
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
