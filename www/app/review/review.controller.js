app.controller("ReviewCtrl", ["$scope", "restaurantId", "$ionicModal", "$ionicListDelegate", "Restaurant", "Review", "$ionicPopup", "User", "ionicMaterialInk", "$timeout",
  function($scope, restaurantId, $ionicModal, $ionicListDelegate, Restaurant, Review, $ionicPopup, User, ionicMaterialInk, $timeout) {

    ionicMaterialInk.displayEffect();

    $scope.$on('ngLastRepeat.reviewList',function(e) {
      $scope.materialize();
    });

    $scope.materialize = function(){
      $timeout(function(){
        ionicMaterialInk.displayEffect();
        },0);
    };

    Restaurant.getReviews(restaurantId).$loaded().then(function(reviews) {
      $scope.reviews = reviews;
      $scope.user = User.auth();
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

    $scope.getReplies = function(reviewId) {
      return Review.getReplies(restaurantId, reviewId);
    }

    $scope.getName = function(reviewerId) {
      return Review.reviewer(reviewerId);
    }

    $ionicModal.fromTemplateUrl('app/review/_new-reply.html', function(addReplyModal) {
      $scope.addReplyModal = addReplyModal;
    }, {
      scope: $scope
    })

    $scope.openReplyModal = function(review) {
      Restaurant.openReplyModal($scope, review);
    }

    $scope.openEditReplyModal = function(reply, reviewId) {
      Restaurant.openEditReplyModal($scope, reply, reviewId, restaurantId);
    }

    $scope.addReply = function(reply) {
      Review.addReply(restaurantId, reply, $scope.reviewId)
      .then(function() {
        reply.content = "";
        $scope.addReplyModal.hide();
      })
    }

    $scope.editReply = function(reply) {
      Review.editReply(reply)
      .then(function() {
        $scope.addReplyModal.hide(); 
      })
    }
  }
])
