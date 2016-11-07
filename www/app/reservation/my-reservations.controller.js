app.controller('MyReservationsCtrl',["$scope", "reservations", "Restaurant",
  function($scope, reservations, Restaurant) {
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

    // $scope.reservations = reservations.map(function(reservation) {
    //   return {
    //     details: reservation,
    //     restaurant: Restaurant.get(reservation.restaurant_id)
    //   }
    // });
  }])
