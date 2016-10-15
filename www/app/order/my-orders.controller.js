app.controller("MyOrdersCtrl",["$scope","orders",
  function($scope, orders){
    $scope.orders = orders;
    console.log("hey my orders");
  }]);
