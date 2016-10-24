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
  $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;
  $scope.RestaurantService = Restaurant;

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

  // $ionicModal.fromTemplateUrl('app/review/new-review.html', function(reviewModal) {
  //   $scope.reviewModal = reviewModal;
  // }, {
  //   scope: $scope
  // });
  // $ionicModal.fromTemplateUrl('app/review/edit-review.html', function(editReviewModal) {
  //   $scope.editReviewModal = editReviewModal;
  // }, {
  //   scope: $scope
  // });

  // $ionicModal.fromTemplateUrl('templates/edit-review.html', function(editModalReview) {
  //   $scope.editReviewModal = editModalReview;
  // }, {
  //   scope: $scope
  // });

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
  $scope.currentLocation ={};
  $scope.markers = [];

  $scope.isMarkerCanChange = true;
  $scope.map =  {center: { latitude: 10.729984, longitude: 122.549298 }, zoom: 12, options: {scrollwheel: false}, bounds: {}, control:{}};

  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    $scope.currentLocation = {latitude: position.coords.latitude,longitude: position.coords.longitude};
  });

  // $scope.setMap = function(restaurant){
  //     $scope.map =  {center:{latitude: restaurant.latitude, longitude: restaurant.longitude}, zoom: 14, options: {scrollwheel: false}, bounds: {}, control: {}};
  //     $scope.restaurantMarkers.push({id: Date.now(),
  //       coords:{latitude:restaurant.latitude, longitude:restaurant.longitude}
  //     });
  // };

  $scope.addMarkers = function(items){
    if(  $scope.isMarkerCanChange){
      $scope.markers.length = 0;
      for (var i = 0; i < items.length; i++) {
        $scope.markers.push({id: items[i].$id,
          coords: {latitude:items[i].latitude, longitude:items[i].longitude}
        });
      }
    }
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model){
      if(model.id != '0'){
        $state.go("tabs.viewRestaurant",{restaurantId:model.id});
      }
    }
  };

  $scope.showNear =function(){
    $scope.tempMarkers = [];
    for (var i = 0; i < $scope.markers.length; i++) {
      var p1 = new google.maps.LatLng($scope.markers[i].coords.latitude, $scope.markers[i].coords.longitude);
      var p2 = new google.maps.LatLng($scope.currentLocation.latitude, $scope.currentLocation.longitude);

      if(calculateDistance(p1,p2)<= 1){
        $scope.tempMarkers.push({id: $scope.markers[i].id,
          coords: $scope.markers[i].coords
        });
      }
    }
    $scope.markers.length =0;
    $scope.markers = $scope.tempMarkers;
    $scope.markers.push({id:0,
      coords:{latitude: $scope.currentLocation.latitude, longitude:$scope.currentLocation.longitude},
      icon: {
        url: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=glyphish_user|edge_bc|FFBB00|000000|You+Are+Here',
        scaledSize: new google.maps.Size(83, 30)
      }
    });
    $scope.map.zoom = 14;
    $scope.map .center ={latitude: $scope.currentLocation.latitude, longitude:$scope.currentLocation.longitude };
    $scope.isMarkerCanChange = false;
  };

  var calculateDistance = function(point1, point2){
    return(google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000).toFixed(2);
  };

  $scope.allowMarkerChange = function(){
    $scope.isMarkerCanChange = true;
  }

  $scope.CallNumber = function(number){
     window.plugins.CallNumber.callNumber(function(){
      console.log("call success");
     }, function(){
       console.log("call failed");
     }, number)
   };

}]);
