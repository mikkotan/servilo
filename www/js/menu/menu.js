app.controller("MenuCtrl",["$scope","menus","Menu", function($scope,menus,Menu){

  $scope.menus = menus ;
  $scope.getRestaurant = Menu.getRestaurant;

}]);
