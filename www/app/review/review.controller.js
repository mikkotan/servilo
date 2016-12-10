app.controller("ReviewCtrl", ["$scope", "restaurantId", "$ionicModal", "$ionicListDelegate", "Restaurant", "Review", "$ionicPopup", "User",
  function($scope, restaurantId, $ionicModal, $ionicListDelegate, Restaurant, Review, $ionicPopup, User) {

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
      // return $firebaseObject(Database.reviewsReference().child(reviewId).child('replies'))
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
      $scope.reply = {};
      console.log('hihihi')
      $scope.newReply = true;
      $scope.replyTitle = "New Reply";
      $scope.reply.content = "";
      $scope.addReplyModal.show();
      $scope.reviewId = review.$id;
    }

    $scope.openEditReplyModal = function(reply, reviewId) {
      $scope.newReply = false;
      $scope.replyTitle = "Edit Reply";
      $scope.addReplyModal.show();
      $scope.reply = {
        content: reply.content,
        $id: reply.$id,
        oldContent: reply.content,
        user_id: reply.user_id,
        reviewId: reviewId,
        restaurantId: restaurantId
      }
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
