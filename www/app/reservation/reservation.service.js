app.factory('Reservation', function($firebaseObject, $firebaseArray, Database, User, Restaurant){

  var Reservation = {
    all : function() {
      return $firebaseArray(Database.reservationsReference());
    },
    create : function(reservation) {
      console.log(reservation.restaurant_id);
      console.log('Reservation Service create function called.');
      Database.reservations().$add(reservation)
        .then(() => {
          console.log(reservation.restaurant_id);
          var receiver = Restaurant.getOwner(reservation.restaurant_id);
          console.log('success')
          Database.notifications().$add({
            sender_id: User.auth().$id,
            receiver_id: receiver.$id,
            restaurant_id: reservation.restaurant_id,
            type: 'reservation',
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
            .then(() => { console.log('success promise notification') })
            .catch((err) => { console.log(err) })
        })
        .catch((err) => { console.log(err) })
    }
  }

  return Reservation;
})
