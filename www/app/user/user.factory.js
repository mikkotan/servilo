app.factory("User",["$firebaseObject" , "$firebaseAuth","$firebaseArray", "UserFactory", "Database","$ionicLoading", "$ionicPopup",
  function($firebaseObject ,$firebaseAuth, $firebaseArray , UserFactory, Database,$ionicLoading, $ionicPopup){

  var rootRef = firebase.database().ref();
  var users = rootRef.child("users");
  // var usersObj = $firebaseArray(users);
  var restaurantsRef = Database.restaurantsReference();
  var notificationsRef = Database.notificationsReference();
  var ordersRef = Database.ordersReference();
  var reservationsRef = Database.reservationsReference();


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
    getUser : function(userId) {
      return $firebaseObject(Database.usersReference().child(userId));
    },
    // getAuthFullName : function() {
    //   var authId = firebase.auth().currentUser.uid;
    //   return $firebaseObject(Database.usersReference())
    //   return usersObj.$getRecord(authId).firstName + " " + usersObj.$getRecord(authId).lastName;
    // },
    getAuthNotifications : function() {
      console.log('get auth notifs');
      var authId = firebase.auth().currentUser.uid;
      var ref = Database.notificationsReference().child(authId);
      return $firebaseArray(ref);
    },
    getAuthNotificationsRef : function() {
      return notificationsRef.orderByChild('receiver_id').equalTo(firebase.auth().currentUser.uid);
    },
    getAuthOrders : function() {
      return $firebaseArray(ordersRef.orderByChild('customer_id').equalTo(firebase.auth().currentUser.uid));
    },
    getAuthDeviceTokens : function() {
      var authId = firebase.auth().currentUser.uid;
      var usrRef = firebase.database().ref().child('users').child(firebase.auth().currentUser.uid).child('device_token');
      return $firebaseArray(usrRef);
    },
    getAuthReservations : function() {
      console.log('Getting auth reservations');
      return $firebaseArray(reservationsRef.orderByChild('user_id').equalTo(firebase.auth().currentUser.uid));
    },
    getAuthFavorites : function() {
      console.log('Getting Auth Favorites');
      var authId = firebase.auth().currentUser.uid;
      return $firebaseArray(Database.userFavoritesReference().child(authId));
    },
    addToFavorites : function(restaurant) {
      var authId = firebase.auth().currentUser.uid;
      $ionicPopup.confirm({
        title: 'Add to Favorites',
        template: "Add '" + restaurant.name + "' to favorites?"
      })
        .then((res) => {
          if (res) {
            Database.userFavoritesReference().child(authId).child(restaurant.$id).set(true);
            this.hasFavored(restaurant.$id);
          }
          else {
            console.log('Cancel add to favorites');
          }
        })
    },
    removeFromFavorites : function(restaurant) {
      var authId = firebase.auth().currentUser.uid;
      console.log(restaurant.restaurant.$id);
      console.log(restaurant.name);
      $ionicPopup.confirm({
        title: 'Remove from Favorites',
        template: "Remove '" + restaurant.name + "' from favorites?"
      })
        .then((res) => {
          if (res) {
            Database.userFavoritesReference().child(authId).child(restaurant.restaurant.$id).set(null);
          }
          else {
            console.log('Cancel remove from favorites');
          }
        })
    },
    hasFavored : function(restaurantId) {
      var authId = firebase.auth().currentUser.uid;
      return Database.userFavoritesReference().child(authId).child(restaurantId).once('value')
        .then((snapshot) => {
          console.log('hasFavored from User.service : '+ (snapshot.val() !== null))
          return (snapshot.val() !== null)
        })
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
            console.log(err?err:"success");
            // $ionicLoading.hide();
          });
        }
        else{
          // $ionicLoading.show();
        }
      })
    }
  };
}]);
