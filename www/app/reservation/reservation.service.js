app.factory('Reservation', function($firebaseObject, $firebaseArray, Database, User, Restaurant, $ionicLoading){

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
            Database.notificationsReference().child(receiver).push().set({
              sender_id: User.auth().$id,
              restaurant_id: reservation.restaurant_id,
              type: 'reservation',
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
              .then(() => {
                console.log('success promise notification')
                $ionicLoading.hide();
                alert('success');
              })
              .catch((err) => {
                console.log(err);
                alert(err);
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
