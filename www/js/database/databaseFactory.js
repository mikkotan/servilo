app.factory("Database", ["$firebaseArray", "$firebaseObject", "$firebaseAuth",
  function($firebaseArray, $firebaseObject, $firebaseAuth) {

    var rootRef = firebase.database().ref();
    var usersRef = rootRef.child('users');
    var menusRef = rootRef.child('menus');
    var reviewsRef = rootRef.child('reviews');
    var pendingsRef = rootRef.child('pending');
    var restaurantsRef = rootRef.child('restaurants');

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
      }
    }

    return Database
  }])