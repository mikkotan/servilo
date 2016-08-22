app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject", "ionicMaterialInk", "MenusWithAvg",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User, $firebaseObject, ionicMaterialInk, MenusWithAvg) {
  console.log('HomeTabCtrl');
  var id = $stateParams.restaurantId;
  var rootRef = firebase.database().ref();
  var reviewRef = rootRef.child("restaurants/"+id).child("reviews");
  var userRfe = rootRef.child("users");

  $scope.reviews = $firebaseArray(reviewRef);
  $scope.userRfeObj = $firebaseArray(userRfe);

  $scope.restaurants = Restaurant.all();
  $scope.getAvg = Restaurant.getAveragePrice;
  $scope.getAvgRating = Restaurant.getAverageRating;
  $scope.getRestaurantStatus = Restaurant.getRestaurantStatus;
  $scope.getUserName = Home.getUserName;


  User.setOnline();
  ionicMaterialInk.displayEffect();

  $scope.rating = {
    rate : 0,
    max: 5
  }

  $scope.$watch('rating.rate', function() {
    console.log('New value: '+$scope.rating.rate);
  });

  $scope.alreadyReviewed = $scope.reviews.$getRecord(User.auth().$id);

  $scope.isAlreadyReviewed = function() {
    reviewRef.child(User.auth().$id).once('value', function(snapshot) {
      $scope.exists = (snapshot.val() !=null );
      console.log("exists or not" + $scope.exists);
    })
  }
  console.log("Reviewed or not? "+$scope.isAlreadyReviewed());
  console.log("scope exists value "+$scope.exists);
  // $scope.RestaurantService = Restaurant;

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
  // $scope.getAvgPrice = function(restaurantId) {
  //   console.log("getting avg price");
  //   var menusRef = firebase.database().ref().child("menus").orderByChild("restaurant_id").equalTo(restaurantId);
  //   var menusArray = new MenusWithAvg(menusRef);
  //   menusArray.$loaded().then(function(){
  //     console.log("The average price of this restaurant is P" + menusArray.avg());
  //     return "hello";
  //   })
  // }



  if($state.is("tabs.viewRestaurant")){
  $scope.restaurant = Restaurant.get(id);
  console.log(id)
  }

  $scope.addReview = function(review) {
    var reviewRating = review.rating;
    var reviewerRef = reviewRef.child(User.auth().$id);
    reviewerRef.set({
      content: review.content,
      rating: review.rating,
      reviewer_id: User.auth().$id,
      startedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(function(){
      console.log("calling callback after add review");
      var res = firebase.database().ref().child("restaurants").child(id);
      var sumRating = res.child("sumRating");
      var totalRatingCount = res.child("totalRatingCount");
      var avgRating = res.child("avgRate");
      var ratingObj = $firebaseObject(totalRatingCount);
      var top = 0;
      var bot = 0;

      sumRating.transaction(function(currentSum){
        console.log("suming up");
        top = currentSum + reviewRating;
        return top;
      })

      totalRatingCount.transaction(function(currentCount){
        console.log("count up");
        bot = currentCount + 1;
        return bot;
      })

      avgRating.transaction(function(currentAmount){
        console.log("calculate avg");
        var avg = top/bot;
        return avg;
      })

    })
    review.content = '';
    review.rating = '';
    $scope.reviewModal.hide();
    $scope.isAlreadyReviewed();
  }

  $scope.newReview = function() {
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
  }

  $scope.setMap = function(restaurant){
      $scope.map =  {center:{latitude: restaurant.latitude, longitude: restaurant.longitude}, zoom: 14, options: {scrollwheel: true}, bounds: {}};
  };
  $scope.marker ={id: 0};

}]);
