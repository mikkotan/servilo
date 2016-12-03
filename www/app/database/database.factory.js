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
    var serviceRef = rootRef.child('service');
    var reservationsRef = rootRef.child('reservations');
    var userFavoritesRef = rootRef.child('user_favorites');
    var userNotificationsRef = rootRef.child('user_notifications');
    var userOrdersRef = rootRef.child('user_orders');
    var restaurantOrdersRef = rootRef.child('restaurant_orders');
    var userReservationsRef = rootRef.child('user_reservations');
    var restaurantReservationsRef = rootRef.child('restuarant_reservations');
    var restaurantMenusRef = rootRef.child('restaurant_menus');
    var restaurantReviewsRef = rootRef.child('restaurant_reviews');
    var userReviewsRef = rootRef.child('user_reviews');


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
      reservationsReference : function() {
        return reservationsRef
      },
      userFavoritesReference : function() {
        return userFavoritesRef
      },
      userNotificationsReference : function() {
        return userNotificationsRef;
      },
      userOrdersReference : function() {
        return userOrdersRef;
      },
      restaurantOrdersReference : function() {
        return restaurantOrdersRef;
      },
      userReservationsReference : function() {
        return userReservationsRef;
      },
      restaurantReservationsReference : function() {
        return restaurantReservationsRef;
      },
      restaurantMenusReference : function() {
        return restaurantMenusRef;
      },
      userReviewsReference : function() {
        return userReviewsRef;
      },
      restaurantReviewsReference : function() {
        return restaurantReviewsRef;
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
      },
      reservations : function() {
        return $firebaseArray(reservationsRef);
      },
      userFavorites : function() {
        return $firebaseArray(userFavorites);
      }
    }

    return Database
  }])
