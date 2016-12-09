app.controller('DashboardInteractCtrl', ['$scope', '$state', '$stateParams',
  function($scope, $state, $stateParams) {
    console.log('DashboardInteract Ctrl run');

    console.log($stateParams.restaurantId);
    $scope.goToOrders = function() {
      $state.go('tabs.dashboard.orders', {restaurantId: $stateParams.restaurantId});
    }

    $scope.goToReservations = function() {
      console.log('click go to reservations');
      $state.go('tabs.dashboard.reservations', {restaurantId: $stateParams.restaurantId});
    }
  }
])
