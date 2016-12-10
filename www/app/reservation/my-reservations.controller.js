app.controller('MyReservationsCtrl', ["$scope", "reservations", "Restaurant", "Database", "$ionicPopup", "Reservation",
  function($scope, reservations, Restaurant, Database, $ionicPopup, Reservation) {
    console.log('my reservations ctrl launched');
    $scope.test = "hello world";

    $scope.tempReservations = reservations;
    console.log(reservations);
    console.log($scope.tempReservations);

    $scope.$watchCollection('tempReservations', function(watchedReservations) {
      $scope.reservations = watchedReservations.map(function(reservation) {
        var r = {
          details: reservation,
          restaurant: function() {
            Restaurant.get(reservation.restaurant_id).$loaded()
              .then((restaurant) => {
                console.log("Restaurant: "+restaurant.name)
                r.restaurant_name = restaurant.name
              })
          }()
        }
        return r;
      })
    })

    $scope.cancel = function(reservation) {
      var cancelPopup = $ionicPopup.confirm({
        title: "Cancel Reservation",
        template: "Are you sure to cancel your reservation for '" + Restaurant.get(reservation.restaurant_id).name + "' ?"
      })

      cancelPopup
        .then((res) => {
          if (res) {
            var ref = Database.reservationsReference().child(reservation.$id).child('status')
            ref.set('cancelled');
          } else {
            console.log('Cancellation failed');
          }
        })

    }

    $scope.confirmRemind = function(reservation) {
      var confirmRemind = $ionicPopup.confirm({
        title: "Confirm Remind State",
        template: "Confirming the remind state means you are sure to go to your booked reservation. Are you sure?"
      })
        .then((res) => {
          if (res) {
            Reservation.update(reservation, 'confirmed')
          }
          else {
           console.log('tapp cancel')
          }
        })
    }

  }
])
