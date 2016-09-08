app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject", "ionicMaterialInk", "MenusWithAvg", "$ionicPopup", "$cordovaGeolocation",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User, $firebaseObject, ionicMaterialInk, MenusWithAvg, $ionicPopup, $cordovaGeolocation) {
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
  $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;



  User.setOnline();
  ionicMaterialInk.displayEffect();

  $scope.rating = {
    rate : 0,
    max: 5
  }

  $scope.$watch('rating.rate', function() {
    console.log('New value: '+$scope.rating.rate);
  });

  $scope.isAlreadyReviewed = function() {
    reviewRef.child(User.auth().$id).once('value', function(snapshot) {
      $scope.exists = (snapshot.val() !=null );
      $scope.review = snapshot.val();
    })
  }
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
  $scope.isAlreadyReviewed();
  }

  $scope.addReview = function(review) {
    var reviewRating = review.rating;
    var reviewerRef = reviewRef.child(User.auth().$id);
    reviewerRef.set({
      content: review.content,
      rating: review.rating,
      prevRating: review.rating,
      reviewer_id: User.auth().$id,
      startedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(function(){
      var res = firebase.database().ref().child("restaurants").child(id);
      var sumRating = res.child("sumRating");
      var totalRatingCount = res.child("totalRatingCount");
      var avgRating = res.child("avgRate");
      var ratingObj = $firebaseObject(totalRatingCount);
      var top = 0;
      var bot = 0;

      sumRating.transaction(function(currentSum){
        top = currentSum + reviewRating;
        return top;
      })

      totalRatingCount.transaction(function(currentCount){
        bot = currentCount + 1;
        return bot;
      })

      avgRating.transaction(function(currentAmount){
        var avg = top/bot;
        return avg;
      })

    })
    review.content = '';
    review.rating = '';
    $scope.reviewModal.hide();
    $scope.isAlreadyReviewed();
  }

  $scope.updateReview = function(review) {
    var reviewerRef = reviewRef.child(User.auth().$id);
    var reviewRating = review.rating;
    reviewerRef.update({
      content: review.content,
      rating: review.rating,
    }).then(function() {
      var res = firebase.database().ref().child("restaurants").child(id);
      var sumRating = res.child("sumRating");
      var totalRatingCount = res.child("totalRatingCount");
      var avgRating = res.child("avgRate");
      var prevRating = reviewerRef.child("prevRating");
      var top = 0;
      var bot = 0;

      sumRating.transaction(function(currentSum){
        top = currentSum - review.prevRating + reviewRating;
        return top;
      })

      totalRatingCount.transaction(function(currentCount){
        console.log("totalcount updated");
        bot = currentCount;
        console.log("current count" +bot);
        return bot;
      })

      avgRating.transaction(function(currentAvg) {
        console.log("avg calculated");
        var avg = top / bot;
        console.log("new avg" + avg);
        return avg;
      })

      prevRating.transaction(function(currentPrevRating) {
        console.log("updating prevRating to new");
        console.log("new prevRating "+reviewRating);
        return reviewRating;
      })
    })
    review.content = '';
    review.rating = '';
    $scope.editReviewModal.hide();
    $scope.isAlreadyReviewed();
  }

  $scope.newReview = function() {
    $scope.reviewModal.show();
  }

  $scope.closeReview = function() {
    $scope.reviewModal.hide();
  }

  $scope.editReview = function() {
    console.log("edit review clicked");
    $scope.editReviewModal.show();
  }

  $scope.closeEditReview = function() {
    $scope.editReviewModal.hide();
  }

  $ionicModal.fromTemplateUrl('templates/new-review.html', function(modalReview) {
    $scope.reviewModal = modalReview;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/edit-review.html', function(editModalReview) {
    $scope.editReviewModal = editModalReview;
  }, {
    scope: $scope
  });

  $scope.showConfirmDelete = function(review) {
    var reviewObj = review;
    var reviewRating = review.rating;
    var reviewContent = review.content;
    var confirmDelete = $ionicPopup.confirm({
      title: "Delete Review",
      template: "Are you sure you want to delete this?"
    })

    confirmDelete.then(function(res) {
      var reviewsDeleteRef = firebase.database().ref().child("restaurants").child(id).child("reviews").child(User.auth().$id);
      if(res){
        var res = firebase.database().ref().child("restaurants").child(id);
        var sumRating = res.child("sumRating");
        var totalRatingCount = res.child("totalRatingCount");
        var avgRating = res.child("avgRate");
        var top = 0;
        var bot = 0;

        sumRating.transaction(function(currentSum) {
          top = currentSum - reviewRating;
          if(top <= 0){
            return 0
          }else {
            return top;
          }
        })

        totalRatingCount.transaction(function(currentCount) {
          bot = currentCount - 1;
          if(bot <= 0){
            return 0;
          }else{
            return bot;
          }
        })

        avgRating.transaction(function(currentAvg) {
          if(bot <= 0){
            return 0;
          }else {
            var avg = top / bot;
            return avg;
          }
        })

        reviewsDeleteRef.remove();
        $scope.isAlreadyReviewed();
      }
      else {
        console.log("delete failed");
      }
    })
  }
  $scope.direction =[];
  $scope.currentLocation ={};
  $scope.marker ={id: 0};
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    $scope.currentLocation = {latitude: position.coords.latitude,longitude: position.coords.longitude};
  });

  $scope.setMap = function(restaurant){
      $scope.map =  {center:{latitude: restaurant.latitude, longitude: restaurant.longitude}, zoom: 14, options: {scrollwheel: false}, bounds: {}};
  };

  $scope.showPath =  function(restaurant){
    var direction = new google.maps.DirectionsService();
    var request = {
      origin: {lat:$scope.currentLocation.latitude,lng:$scope.currentLocation.longitude},
      destination: {lat: restaurant.latitude, lng: restaurant.longitude},
      travelMode: google.maps.DirectionsTravelMode['DRIVING'],
      optimizeWaypoints: true
    };
    direction.route(request, function(response, status){
      var steps = response.routes[0].legs[0].steps;
      for(i=0; i<steps.length; i++){
        var strokeColor = '#049ce5';
        if((i%2)==0){
          strokeColor = '#FF9E00';
        }
        $scope.direction.push({id:i,paths:steps[i].path, stroke: {
            color: strokeColor,
            weight: 5
        }});
        }
        $scope.$apply();
    });
  };

}]);
