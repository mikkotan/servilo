app.controller("GalleryCtrl", ["$scope", "Gallery", "$timeout", "$ionicLoading",
  function($scope, Gallery, $timeout, $ionicLoading) {
  $ionicLoading.hide()
  $scope.items = Gallery.get();
  $scope.loadContent = false;
  
  $timeout(function() {
	$scope.loadContent = true;
  }, 500);

}]);
