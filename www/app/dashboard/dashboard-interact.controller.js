app.controller('DashboardInteractCtrl', ['$scope', '$state', '$stateParams',
  function($scope, $state, $stateParams) {
    console.log('DashboardInteract Ctrl run');

    console.log($stateParams.restaurantId);
    $scope.goToOrders = function() {
      $state.go('tabs.orders', {restaurantId: $stateParams.restaurantId});
    }
  }
])
