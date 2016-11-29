app.controller('MyReservationsCtrl', ["$scope", "reservations", "Restaurant", "Database", "$ionicPopup",
  function($scope, reservations, Restaurant, Database, $ionicPopup) {
    console.log('my reservations ctrl launched');
    $scope.test = "hello world";

    $scope.tempReservations = reservations;
    console.log(reservations);
    console.log($scope.tempReservations);

    $scope.$watchCollection('tempReservations', function(watchedReservations) {
      $scope.reservations = watchedReservations.map(function(reservation) {
        return {
          details: reservation,
          restaurant: Restaurant.get(reservation.restaurant_id)
        }
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

  }
])
