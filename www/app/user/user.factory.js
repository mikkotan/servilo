app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory", "Database","$ionicLoading",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory, Database,$ionicLoading){

  var rootRef = firebase.database().ref();
  var users = rootRef.child("users");
  var usersObj = $firebaseArray(users);
  var restaurantsRef = Database.restaurantsReference();
  var notificationsRef = Database.notificationsReference();
  var ordersRef = Database.ordersReference();

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
    getAuthOrders : function() {
      return $firebaseArray(ordersRef.orderByChild('customer_id').equalTo(firebase.auth().currentUser.uid));
    },
    getAuthDeviceTokens : function() {
      var authId = firebase.auth().currentUser.uid;
      var usrRef = firebase.database().ref().child('users').child(firebase.auth().currentUser.uid).child('device_token');
      console.log('calling auth device tokens method ref: '+usrRef);
      console.log(usrRef);
      return $firebaseArray(usrRef);
    },
    getUserFullname : function(id){
      return  usersObj.$getRecord(id).firstName + " " + usersObj.$getRecord(id).lastName;
    },
    register : function(userId){
      return $firebaseArray(users.child(userId));
    },
    setOnline : function(id) {
      var conRef = rootRef.child(".info/connected");
      var online = users.child(id +'/online');

      conRef.on('value', function(data) {
        if(data.val() === true){
          var con = online.push(true);
          con.onDisconnect().remove(function(err){
            console.log((err?err:"success"));
            $ionicLoading.hide();
          });
        }
        else{
          $ionicLoading.show();
        }
      })
    }
  };
}]);
