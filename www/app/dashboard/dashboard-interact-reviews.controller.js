app.controller('DashboardInteractReviewsCtrl', function($scope, $stateParams, Restaurant, Review) {

  $scope.restaurantId = $stateParams.restaurantId;

  $scope.getName = function(id) {
    return Review.reviewer(id);
  }

  Restaurant.getReviews($scope.restaurantId).$loaded()
    .then((reviews) => {
      $scope.reviews = reviews
    })

})
