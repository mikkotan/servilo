app.controller('HomeTabCtrl',
  ["$scope","$ionicModal","$firebaseArray","Auth", "Restaurant", "Home" ,"$stateParams", "$state", "User",
    "$firebaseObject", "ionicMaterialInk", "MenusWithAvg", "$ionicPopup", "$cordovaGeolocation", "$ionicLoading", "$cordovaImagePicker",
     "Database", "Review", "restaurants",
        function($scope, $ionicModal, $firebaseArray, Auth, Restaurant, Home, $stateParams, $state,
            User, $firebaseObject, ionicMaterialInk, MenusWithAvg, $ionicPopup, $cordovaGeolocation, $ionicLoading,
             $cordovaImagePicker, Database, Review, restaurants) {

  console.log('HomeTabCtrl');

  $scope.usersRefObj = Database.users(); //new
  // Database.restaurants().$loaded().then(function() {
  //   console.log($scope.restaurants.length);
  // }); //try
  $scope.restaurants = restaurants; //new
  $scope.getAvg = Restaurant.getAveragePrice;
  $scope.getAvgRating = Restaurant.getAverageRating;
  $scope.getReviewer = Review.reviewer;
  $scope.RestaurantService = Restaurant;
  $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;

  Auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      User.setOnline(firebaseUser.uid);
    }
  })

  ionicMaterialInk.displayEffect();

  $scope.rating = {
    rate : 0,
    max: 5
  }

  // if ($state.is("tabs.viewRestaurant")) {
  //   var id = $stateParams.restaurantId;
  // var userReviewsRef = Database.usersReference().child(User.auth().$id).child('reviewed_restaurants').child(id); //new subs below
  // var restaurantReviewsRef = Database.reviewsReference().orderByChild('restaurant_id').equalTo(id); //new subs above
  //
  //   $scope.isAlreadyReviewed = function() {
  //     userReviewsRef.once('value', function(snapshot) {
  //       $scope.exists = (snapshot.val() !=null );
  //       $scope.review = $firebaseObject(Database.reviewsReference().child(snapshot.val()));
  //     })
  //   }
  //
  //   $scope.restaurant = Restaurant.get(id);
  //   $scope.getRestaurantStatus = Restaurant.getRestaurantStatus(Restaurant.get(id).owner_id);
  //   $scope.restaurantService = Restaurant.getRestaurantOpenStatus(id)
  //   $scope.isAlreadyReviewed();
  //   $scope.restaurantReviews = $firebaseArray(restaurantReviewsRef);
  //   // $scope.restaurantReviews = $firebaseArray(Database.reviewsReference().orderByChild('restaurant_id').equalTo(id));
  // }

  $scope.images = [];
  // $scope.editImages = [];

  $scope.selImages = function() {
    var options = {
      maximumImagesCount: 10,
      width: 800,
      height: 800,
      quality: 80
    };
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          window.plugins.Base64.encodeFile(results[i], function(base64){
            $scope.images.push(base64);
            $scope.$apply();
          });
        }
      }, function (error) {
        console.log('Error: ' + error);
      }, {
        maximumImagesCount: 10,
        width: 800,
        quality: 80,
        // outputType: window.imagePicker.OutputType.BASE64_STRING or 1
      }
    );
  };

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
      $scope.isAlreadyReviewed();
      $scope.reviewModal.hide();
      review.content = '';
      $scope.review.rating = 0;
      $scope.rating.rate = 0;
      $scope.images = [];
    })
    var restaurant_owner = Restaurant.getOwner(id);
    Database.notifications().$add({
      sender_id : User.auth().$id,
      receiver_id : restaurant_owner.$id,
      restaurant_id : id,
      type : 'review'
    }).then(function() {
      console.log("hello notification squad");
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

  $scope.markers =[];
  $scope.map =  {center: { latitude: 10.729984, longitude: 122.549298 }, zoom: 12, options: {scrollwheel: false}, bounds: {}};

  $scope.setMap = function(restaurant){
      $scope.map =  {center:{latitude: restaurant.latitude, longitude: restaurant.longitude}, zoom: 14, options: {scrollwheel: false}, bounds: {}};
      $scope.restaurantMarkers.push({id: Date.now(),
        coords:{latitude:restaurant.latitude, longitude:restaurant.longitude}
      });
  };

  $scope.addMarkers = function(items){
     $scope.markers.length = 0;
     for (var i = 0; i < items.length; i++) {
      $scope.markers.push({id: items[i].$id,
        coords: {latitude:items[i].latitude, longitude:items[i].longitude}
      });
    }

  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
        $state.go("tabs.viewRestaurant",{restaurantId:model.id});
    }
  };
  
  $scope.CallNumber = function(number){
     window.plugins.CallNumber.callNumber(function(){
      console.log("call success");
     }, function(){
       console.log("call failed");
     }, number)
   };

}]);
