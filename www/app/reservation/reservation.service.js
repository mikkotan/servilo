app.factory('Reservation', function($firebaseObject, $firebaseArray, Database, User, Restaurant, $ionicLoading, Notification){

  var Reservation = {
    all : function() {
      return $firebaseArray(Database.reservationsReference());
    },
    get : function(reservationId) {
      return $firebaseObject(Database.reservationsReference().child(reservationId));
    },
    update : function(reservation, updateStatus) {
      return Database.reservationsReference().child(reservation.$id).update({ status: updateStatus })
        .then(() => {
          Restaurant.get(reservation.restaurant_id).$loaded()
            .then((restaurant) => {
              var receiverId;
              if (updateStatus !== 'remind') {
                receiverId = restaurant.owner_id
              }
              else {
                receiverId = reservation.user_id
              }

              return Notification.create({
                sender_id: User.auth().$id,
                receiver_id: receiverId,
                restaurant_id: restaurant.$id,
                type: 'reservation_status',
                status: updateStatus,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })

            })
        })
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
                Restaurant.get(reservation.restaurant_id).$loaded()
                  .then((restaurant) => {
                    return Notification.create({
                      sender_id: User.auth().$id,
                      receiver_id: restaurant.owner_id,
                      restaurant_id: reservation.restaurant_id,
                      type: 'reservation',
                      timestamp: firebase.database.ServerValue.TIMESTAMP
                    })
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
