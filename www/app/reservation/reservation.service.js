app.factory('Reservation', function($firebaseObject, $firebaseArray, Database, User, Restaurant, $ionicLoading, Notification){

  var Reservation = {
    all : function() {
      return $firebaseArray(Database.reservationsReference());
    },
    create: function(reservation) {
      console.log('create');
      var pushRef = Database.reservationsReference().push();
      return pushRef.set(reservation)
        .then(() => {
           Database.userReservationsReference().child(reservation.user_id).child(pushRef.key).set(true)
            .then(() => {
             Database.restaurantReservationsReference().child(reservation.restaurant_id).child(pushRef.key).set(true)
              .then(() => {
                return Notification.create({
                  sender_id: User.auth().$id,
                  receiver_id: receiver,
                  restaurant_id: reservation.restaurant_id,
                  type: 'reservation',
                  timestamp: firebase.database.ServerValue.TIMESTAMP
                })
              })
            })
        })
    },
    delete: function(reservationId) {
      console.log('delete');
      return Database.reservationsReference().child(reservationId).once('value')
        .then((reservation) => {
          var reservation_id = reservation.key
          var user_id = reservation.val().user_id
          var restaurant_id = reservation.val().restaurant_id
          Database.reservationsReference().child(reservation_id).set(null)
            .then(() => {
              Database.userReservationsReference().child(user_id).child(reservation_id).set(null)
                .then(() => {
                  return Database.restaurantReservationsReference().child(restaurant_id).child(reservation_id).set(null)
                })
            })
        })
    }

  }

  return Reservation;
})
