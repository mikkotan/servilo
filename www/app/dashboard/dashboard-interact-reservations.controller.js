app.controller('DashboardInteractReservationsCtrl', function($scope, $stateParams, User, Restaurant, Reservation, $ionicPopup, $ionicLoading, $ionicModal) {
  console.log('dashboard interact reservations ctrl');
  $ionicLoading.show();
  $scope.restaurantId = $stateParams.restaurantId;

  $scope.reservation = {
    name : '',
    number_of_persons : 2,
    datetime: new Date()
  }

  $scope.bookReservation = function(reservation) {
    reservation.datetime = reservation.datetime.getTime()
    reservation.status = 'walk-in'
    reservation.user_id = User.auth().$id
    reservation.timestamp = firebase.database.ServerValue.TIMESTAMP
    reservation.restaurant_id = $scope.restaurantId
    
    console.log(JSON.stringify(reservation));
    $scope.walkinReservationModal.hide();
    Reservation.create(reservation)
      .then((res) => {
        console.log('Reserve')
      })
      .catch((err) => {
        console.log('fail')
      })
  }

  $scope.confirm = function(reservation) {
    console.log('confirm reservation')
    var confirm = $ionicPopup.confirm({
      title: 'Confirm Reservation',
      template: 'Confirm Reservation #' + reservation.timestamp + '?'
    })
      .then((res) => {
        if (res) {
          console.log('tapped ok')
          Reservation.update(reservation.$id, 'confirmed')
        }
        else {
          console.log('tapped cancel')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  $scope.reject = function(reservation) {
    console.log('reject reservation')
    var confirm = $ionicPopup.confirm({
      title: 'Reject Reservation',
      template: 'Reject Reservation #' + reservation.timestamp + '?'
    })
      .then((res) => {
        if (res) {
          console.log('tapped ok')
          Reservation.update(reservation.$id, 'cancelled')
        }
        else {
          console.log('tapped cancel')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  $scope.walkinReservation = function() {
    $scope.walkinReservationModal.show();
  }

  $scope.addReservationModal = function() {
    $scope.walkinReservationModal.hide();
  }

  $ionicModal.fromTemplateUrl('app/reservation/_add-reservation.html', function(walkinReservationModal) {
    $scope.walkinReservationModal = walkinReservationModal;
  }, {
    scope: $scope
  })

  $scope.setHours = function() {
    var hoursPopup = $ionicPopup.confirm({
      title: 'Set Opening and Closing Hours',
      templateUrl: 'app/dashboard/_popout-hours.html',
      cssClass: 'custom-popup',
      scope: $scope
    });
  };

  Restaurant.getReservations($scope.restaurantId).$loaded()
    .then((reservations) => {
      $scope.tempReservations = reservations;

      $scope.$watchCollection('tempReservations', function(newReservations) {
        $scope.reservations = newReservations.map(function(reservation) {
          var r = {
            get : Reservation.get(reservation.$id).$loaded()
              .then((reservation) => {
                if (reservation.length == 0) {
                  $ionicLoading.hide();
                }
                console.log(reservation);
                r.details = reservation


                User.getUser(reservation.user_id).$loaded()
                  .then((user) => {
                    if (user.provider !== 'email') {
                      r.customer_name = user.displayName
                    }
                    else {
                      r.customer_name = user.firstName + " " + user.lastName
                    }
                    r.ready = true
                    $ionicLoading.hide();
                  })
              })
          }
          return r;
        })
      })

    })

})
