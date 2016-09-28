// app.controller("ViewRestaurantCtrl",["$scope","currentUser","review","$firebaseArray","$firebaseObject","Database",
//   function($scope,currentUser,review,$firebaseArray,$firebaseObject,Database){
    app.controller("ViewRestaurantCtrl",["$scope","currentUser","userReview",
    "restaurantReview","$firebaseArray","$firebaseObject","Database","$ionicLoading","$ionicModal",
      function($scope,currentUser,userReview,restaurantReview,
        $firebaseArray,$firebaseObject,Database,$ionicLoading,$ionicModal){


  console.log("View Restaurant Ctrl")
    var id = $stateParams.restaurantId;
    $scope.restaurants = Database.restaurants();//new
    $scope.usersRefObj = Database.users(); //new
  $scope.isAlreadyReviewed = function() {
    userReviewsRef.once('value', function(snapshot) {
      $scope.exists = (snapshot.val() !=null );
      $scope.review = $firebaseObject(Database.reviewsReference().child(snapshot.val()));
    })
  }

  $scope.restaurant = Restaurant.get(id);
  $scope.isAlreadyReviewed();
  $scope.restaurantReviews = $firebaseArray(restaurantReviewsRef);

  $scope.addReview = function(review) {
    $ionicLoading.show();
    console.log("wewewe");
    var reviewRating = review.rating;
    Database.reviews().$add({
      content: review.content,
      rating: review.rating,
      prevRating: review.rating,
      reviewer_id: User.auth().$id,
      restaurant_id : id,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(function(review) {
      $ionicLoading.hide();
      var newImages = Database.reviewsReference().child(review.key).child('images');
      var list = $firebaseArray(newImages);
      for (var i = 0; i < $scope.images.length; i++) {
        list.$add({ image: $scope.images[i] }).then(function(ref) {
          console.log("added..." + ref);
        });
      }
      console.log("add review done");
      Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id).set(review.key);
      // Database.restaurantsReference().child(id).child('reviews').child(review.key).set(true); //new
      // Database.restaurantsReference().child(id).child('reviewers').child(User.auth().$id).set(true); //new
      $scope.isAlreadyReviewed();
      $scope.reviewModal.hide();
      review.content = '';
      $scope.review.rating = 0;
      $scope.rating.rate = 0;
      $scope.images = [];
    })
  }

  $scope.updateReview = function(review) {
    // console.log("hiiii");
    var reviewRef = Database.reviewsReference().child(review.$id);
    var reviewRating = review.rating;
    reviewRef.update({
      content: review.content,
      rating: review.rating
    }).then(function() {
      console.log("finished updating review.");
      // var newImages = newReviewRef.child(review.$id).child('images');
      // var list = $firebaseArray(newImages);
      // for (var i = 0; i < $scope.images.length; i++) {
      //   list.$add({ image: $scope.images[i] }).then(function(ref) {
      //     console.log("added..." + ref);
      //   });
      // }
    })
    review.content = '';
    $scope.review.rating = 0;
    $scope.rating.rate = 0;
    $scope.editReviewModal.hide();
    $scope.isAlreadyReviewed();
    $scope.images = [];
  };

  $ionicModal.fromTemplateUrl('templates/new-review.html', function(reviewModal) {
    $scope.reviewModal = reviewModal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('templates/edit-review.html', function(editReviewModal) {
    $scope.editReviewModal = editReviewModal;
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
      template: "Delete '" + reviewContent +"'?"
    })

    confirmDelete.then(function(res) {
      var reviewsDeleteRef = firebase.database().ref().child('reviews').child(review.$id);
      if(res){
        reviewsDeleteRef.remove();
        userReviewsRef.remove();
        $scope.isAlreadyReviewed();
        $scope.review = {};
        $scope.rating.rate = 0;

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
      $scope.restaurantMarkers.push({id: Date.now(),
        coords:{latitude:restaurant.latitude, longitude:restaurant.longitude}
      });
  };

  $scope.addMarker = function(restaurant){
    $scope.markers.push({id: restaurant.$id,
      coords: {latitude:restaurant.latitude, longitude:restaurant.longitude}
    });
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
        $state.go("tabs.viewRestaurant",{restaurantId:model.id});
    }
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

      var distance =response.routes[0].legs[0].distance.value/1000;
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
