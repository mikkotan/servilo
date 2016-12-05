app.controller("ReviewCtrl", ["$scope", "restaurantId", "$ionicModal", "$ionicListDelegate", "Restaurant", "Review", "$ionicPopup",
  function($scope, restaurantId, $ionicModal, $ionicListDelegate, Restaurant, Review, $ionicPopup) {

    Restaurant.getReviews(restaurantId).$loaded().then(function(reviews) {
      $scope.reviews = reviews;
    });

    $scope.noMoreItemsAvailable = false;

    $scope.loadMore = function() {
      Restaurant.getReviews(restaurantId).$loaded().then(function(reviews) {
        lastKey = Review.getLastKey(reviews);
        Review.nextReviews(lastKey, restaurantId).$loaded().then(function(data) {
          if(data.length <= 0) {
            console.log('wala na reviews hehe')
            $scope.noMoreItemsAvailable = true;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.reviews = $scope.reviews.concat(data);
        })
      })
    };
  }
])
