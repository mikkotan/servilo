app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject", "ionicMaterialInk", "MenusWithAvg", "$ionicPopup", "$cordovaGeolocation", "$ionicLoading",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User, $firebaseObject, ionicMaterialInk, MenusWithAvg, $ionicPopup, $cordovaGeolocation, $ionicLoading) {
  console.log('HomeTabCtrl');

  var rootRef = firebase.database().ref();
  // var reviewRef = rootRef.child("restaurants/"+id).child("reviews");
  var newReviewRef = rootRef.child("reviews"); //new
  var userRfe = rootRef.child("users");



  $scope.newReviews = $firebaseArray(newReviewRef); //new
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
    console.log("isAlreadyReviewd fired");
    var userReviewsRefs = rootRef.child('users').child(User.auth().$id).child('reviewed_restaurants').child(id); //new
    console.log("bb "+userReviewsRefs);
    userReviewsRefs.once('value', function(snapshot) {
      $scope.exists = (snapshot.val() !=null );
      $scope.review = $firebaseObject(rootRef.child("reviews").child(snapshot.val()));
      console.log("exists "+$scope.exists);
      console.log("isAlreadyReviewed Method review "+$scope.review.content);
    })
  }

  if($state.is("tabs.viewRestaurant")){
    var id = $stateParams.restaurantId;
    var userReviewsRef = rootRef.child('users').child(User.auth().$id).child('reviewed_restaurants').child(id); //new
    var reviewRef = rootRef.child("reviews").orderByChild('restaurant_id').equalTo(id);

    $scope.restaurant = Restaurant.get(id);
    $scope.isAlreadyReviewed();
    $scope.reviews = $firebaseArray(reviewRef);
  }



  $scope.addReview = function(review) {
    $ionicLoading.show();
    var reviewRating = review.rating;
    // var reviewerRef = reviewRef.child(User.auth().$id);
    $scope.newReviews.$add({
      content: review.content,
      rating: review.rating,
      prevRating: review.rating,
      reviewer_id: User.auth().$id,
      restaurant_id : id,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(function(review) {
      var userRef = rootRef.child('users').child(User.auth().$id).child('reviewed_restaurants').child(id); //new
      userRef.set(review.key); //new
      console.log("then is finished");
      $scope.isAlreadyReviewed();
      $ionicLoading.hide();
      $scope.reviewModal.hide();
    })
    review.content = '';
    review.rating = '';
  }

  $scope.updateReview = function(review) {
    var reviewerRef = newReviewRef.child(review.$id);
    var reviewRating = review.rating;
    reviewerRef.update({
      content: review.content,
      rating: review.rating,
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
    console.log("review id "+review.$id);
    console.log("review rating" + review.rating);
    var reviewObj = review;
    var reviewRating = review.rating;
    var reviewContent = review.content;
    var confirmDelete = $ionicPopup.confirm({
      title: "Delete Review",
      template: "Are you sure you want to delete this?"
    })

    confirmDelete.then(function(res) {
      // var reviewsDeleteRef = firebase.database().ref().child("restaurants").child(id).child("reviews").child(User.auth().$id);
      var reviewsDeleteRef = firebase.database().ref().child('reviews').child(review.$id);
      console.log("aa "+reviewsDeleteRef);
      if(res){
        reviewsDeleteRef.remove();
        userReviewsRef.remove();
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
