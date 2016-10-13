app.factory("Database", ["$firebaseArray", "$firebaseObject", "$firebaseAuth",
  function($firebaseArray, $firebaseObject, $firebaseAuth) {

    var rootRef = firebase.database().ref();
    var usersRef = rootRef.child('users');
    var menusRef = rootRef.child('menus');
    var reviewsRef = rootRef.child('reviews');
    var pendingsRef = rootRef.child('pending');
    var restaurantsRef = rootRef.child('restaurants');
    var notificationsRef = rootRef.child('notifications');
    var ordersRef = rootRef.child('orders');
    var serviceRef = rootRef.child('service')


    var Database = {
      rootReference : function() {
        return rootRef;
      },
      usersReference : function() {
        return usersRef;
      },
      menusReference : function() {
        return menusRef;
      },
      reviewsReference : function() {
        return reviewsRef;
      },
      pendingsReference : function() {
        return pendingsRef;
      },
      restaurantsReference : function() {
        return restaurantsRef;
      },
      notificationsReference : function() {
        return notificationsRef;
      },
      ordersReference : function() {
        return ordersRef;
      },
      serviceReference : function() {
        return serviceRef
      },
      services : function(){
        return $firebaseArray(serviceRef)
      },
      users : function() {
        return $firebaseArray(usersRef);
      },
      menus : function() {
        return $firebaseArray(menusRef);
      },
      reviews : function() {
        return $firebaseArray(reviewsRef);
      },
      pendings : function() {
        return $firebaseArray(pendingsRef);
      },
      restaurants : function() {
        return $firebaseArray(restaurantsRef);
      },
      notifications : function() {
        return $firebaseArray(notificationsRef);
      },
      orders : function() {
        return $firebaseArray(ordersRef);
      },
      userOnlineTrue : function(){
        return $firebaseArray(usersRef.child(firebase.auth().currentUser.uid +'/online'));
      }
    }

    return Database
  }])
