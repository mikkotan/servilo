app.controller("GalleryCtrl", ["$scope", "Gallery", "$timeout",
  function($scope, Gallery, $timeout) {

  $scope.items = Gallery.get();
  $scope.loadContent = false;
  
  $timeout(function() {
	$scope.loadContent = true;
  }, 500);

}]);
