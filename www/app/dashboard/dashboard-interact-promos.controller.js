app.controller('DashboardInteractPromosCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, $ionicPopup, Promo, Restaurant, Upload) {
  console.log('eheheh lleo');
  $scope.restaurantId = $stateParams.restaurantId;

  $scope.imageURL = "";
  $scope.upload = function(index) {
    navigator.camera.getPicture(function(imageData) {
      Upload.promo(imageData).then(function(downloadURL) {
        $scope.imageLoading = false;
        $scope.imageURL = downloadURL;
      })
    }, function(message) {
      console.log('Failed because: ' + message);
      $scope.imageLoading = false;
      $scope.$apply();
    }, Upload.getOptions(index));
    $scope.imageLoading = true;
  }

  $scope.newPromo = function(promo) {
    $ionicLoading.show();
    console.log(promo);
    Promo.create({
      restaurant_id: $scope.restaurantId,
      photoURL: $scope.imageURL,
      name: promo.name,
      description: promo.description,
      startDate: promo.startDate.getTime(),
      endDate: promo.endDate.getTime(),
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
      .then(() => {
        $ionicLoading.hide();
        alert('Success');
        $scope.addPromoModal.hide();
      })
      .catch((err) => {
        $scope.addPromoModal.hide();
        alert(err)
      })
  }

  $scope.delete = function(promo) {
    $ionicPopup.confirm({
      title: "Delete Promo",
      template: "Delete '" + promo.name + "' promo?"
    })
      .then((res) => {
        if (res) {
          return Promo.delete(promo)
        }
      })
  }

  Restaurant.getPromos($scope.restaurantId).$loaded()
    .then((promos) => {
      $scope.promos = promos
      $scope.ready = true
    })

  $ionicModal.fromTemplateUrl('app/dashboard/_add-promo-modal.html', function(addPromoModal) {
    $scope.addPromoModal = addPromoModal;
  }, {
    scope: $scope
  })

})
