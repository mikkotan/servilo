app.controller('DashboardInteractPromosCtrl', function($scope, $stateParams, $ionicModal, Promo, $ionicLoading, Restaurant) {
  console.log('eheheh lleo');
  $scope.restaurantId = $stateParams.restaurantId;

  $scope.newPromo = function(promo) {
    $ionicLoading.show();
    console.log(promo);
    Promo.create({
      restaurant_id: $scope.restaurantId,
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
