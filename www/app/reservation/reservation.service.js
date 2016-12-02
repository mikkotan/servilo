app.factory('Reservation', function($firebaseObject, $firebaseArray, Database, User, Restaurant, $ionicLoading, Notification){

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
         Restaurant.get(reservation.restaurant_id)
          .then((restaurant) => {
            var receiver = restaurant.owner_id
            console.log('success')
            Notification.create({
              sender_id: User.auth().$id,
              receiver_id: receiver,
              restaurant_id: reservation.restaurant_id,
              type: 'reservation',
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          })
        })
        .catch((err) => {
          alert(err);
          console.log(err)
        })
    }
  }

  return Reservation;
})
