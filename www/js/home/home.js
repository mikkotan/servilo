app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject", "ionicMaterialInk",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User, $firebaseObject, ionicMaterialInk) {
  console.log('HomeTabCtrl');
  ionicMaterialInk.displayEffect();

    $scope.rating = {
      rate : 0,
      max: 5
    }

    $scope.$watch('rating.rate', function() {
      console.log('New value: '+$scope.rating.rate);
    });

    // $scope.RestaurantService = Restaurant;
    $scope.restaurants = Restaurant.all();
    $scope.getAvg = Restaurant.getAveragePrice;
    $scope.getAvgRating = Restaurant.getAverageRating;
    // $scope.getAvg = function(restaurantId){
    //   var getRealAvg = 1;
    //   Restaurant.getAveragePrice(restaurantId).then(function(value){
    //     console.log("RETURN VALUE ++"+value);
    //     // $scope.getAvg = value;
    //     getRealAvg = value;
    //     console.log("Scope get avg here "+ getRealAvg)
    //     // return value;
    //     return getRealAvg;
    //   })
    //
    // }


    $scope.getUserName = Home.getUserName;
    var id = $stateParams.restaurantId;
    var reviewRef = firebase.database().ref("restaurants/"+id+"/reviews");
    $scope.reviews = $firebaseArray(reviewRef);

    var userRfe = firebase.database().ref().child('users');
    $scope.userRfeObj = $firebaseArray(userRfe);

  $scope.getRestaurantStatus = Restaurant.getRestaurantStatus;

  if($state.is("tabs.viewRestaurant")){
  $scope.restaurant = Restaurant.get(id);
  console.log(id)
  }

  $scope.addReview = function(review) {
    console.log("added review");
    console.log("review rate:"+review.rating);
    var reviewRating = review.rating;
    $scope.reviews.$add({
      content: review.content,
      rating: review.rating,
      reviewer_id: User.auth().$id,
      startedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(function(){
      console.log("Calling callback review");
      console.log("review rate after callback: "+reviewRating);
      var res = firebase.database().ref().child("restaurants").child(id);
      var sumRating = res.child("sumRating");
      var totalRatingCount = res.child("totalRatingCount");

      sumRating.transaction(function(currentSum){
        console.log("adding rating sum");
        // console.log("currentSumRating: "+currentSum);
        console.log(reviewRating);
        return currentSum + reviewRating;

      })

      totalRatingCount.transaction(function(currentCount){
        console.log("adding rating count");
        return currentCount+1;
      })

    })
    review.content = '';
    review.rating = '';
    $scope.reviewModal.hide();
  }

  $scope.newReview = function() {
    console.log("new review clicked");
    $scope.reviewModal.show();
  }

  $scope.closeReview = function() {
    $scope.reviewModal.hide();
  }

  $ionicModal.fromTemplateUrl('templates/new-review.html', function(modalReview) {
    $scope.reviewModal = modalReview;
  }, {
    scope: $scope
  });

  if($state.is("tabs.viewRestaurant")){
    $scope.restaurant = Restaurant.get(id);
    console.log(id)
  }
}]);
