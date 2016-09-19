app.controller('HomeTabCtrl', ["$scope","$ionicModal",

"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject", "ionicMaterialInk", "MenusWithAvg", "$ionicPopup", "$cordovaGeolocation", "$ionicLoading",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User,
  $firebaseObject, ionicMaterialInk, MenusWithAvg, $ionicPopup, $cordovaGeolocation, $ionicLoading) {
  console.log('HomeTabCtrl');

  var rootRef = firebase.database().ref();
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

  function setNull(){

  }
  $scope.signOut = function(callback) {
    User.auth.online = null;
    Auth.$signOut();
    console.log("bye");
    $state.go("tabs.login");
  }


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
    // $scope.getAvgPrice = function(restaurantId) {
    //   console.log("getting avg price");
    //   var menusRef = firebase.database().ref().child("menus").orderByChild("restaurant_id").equalTo(restaurantId);
    //   var menusArray = new MenusWithAvg(menusRef);
    //   menusArray.$loaded().then(function(){
    //     console.log("The average price of this restaurant is P" + menusArray.avg());
    //     return "hello";
    //   })
    // }


    $scope.getUserName = Home.getUserName;

    var id = $stateParams.restaurantId;
    var reviewRef = firebase.database().ref("restaurants/"+id+"/reviews");
    $scope.reviews = $firebaseArray(reviewRef);

    var userRfe = firebase.database().ref().child('users');
    $scope.userRfeObj = $firebaseArray(userRfe);

  $scope.getRestaurantStatus = Restaurant.getRestaurantStatus;

  if($state.is("tabs.viewRestaurant")){
    var id = $stateParams.restaurantId;
    var userReviewsRef = rootRef.child('users').child(User.auth().$id).child('reviewed_restaurants').child(id); //new
    var reviewRef = rootRef.child("reviews").orderByChild('restaurant_id').equalTo(id);

    $scope.isAlreadyReviewed = function() {
      var userReviewsRefs = rootRef.child('users').child(User.auth().$id).child('reviewed_restaurants').child(id); //new
      userReviewsRefs.once('value', function(snapshot) {
        $scope.exists = (snapshot.val() !=null );
        $scope.review = $firebaseObject(rootRef.child("reviews").child(snapshot.val()));
      })
    }

    $scope.restaurant = Restaurant.get(id);
    $scope.isAlreadyReviewed();
    $scope.reviews = $firebaseArray(reviewRef);
  }




  $scope.addReview = function(review) {
    $ionicLoading.show();
    var reviewRating = review.rating;
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
      $scope.isAlreadyReviewed();
      $ionicLoading.hide();
      $scope.reviewModal.hide();
      review.content = '';
      review.rating = '';
    })
  }

  $scope.updateReview = function(review) {
    var reviewerRef = newReviewRef.child(review.$id);
    var reviewRating = review.rating;
    reviewerRef.update({
      content: review.content,
      rating: review.rating
    })

    review.content = '';
    review.rating = '';
    $scope.editReviewModal.hide();
    $scope.isAlreadyReviewed();
  };
  $ionicModal.fromTemplateUrl('templates/new-review.html', function(modalReview) {
    $scope.modalReview = modalReview;
  }, {
    scope: $scope
  });


  if($state.is("tabs.viewRestaurant")){
    $scope.restaurant = Restaurant.get(id);
    console.log(id);
  }
  $ionicModal.fromTemplateUrl('templates/edit-review.html', function(editModalReview) {
    $scope.editModalReview = editModalReview;
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
      var reviewsDeleteRef = firebase.database().ref().child('reviews').child(review.$id);
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
  $scope.markers =[];
  $scope.restaurantMarkers =[];
  $scope.map =  {center: { latitude: 10.729984, longitude: 122.549298 }, zoom: 12, options: {scrollwheel: false}, bounds: {}};

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
    $scope.markers.push({id: Date.now(),
      coords: {latitude:restaurant.latitude, longitude:restaurant.longitude}
    });
  };

  $scope.showPath =  function(restaurant){
    var direction = new google.maps.DirectionsService();
    $scope.map.zoom = 12;
    var request = {
      origin: {lat:$scope.currentLocation.latitude,lng:$scope.currentLocation.longitude},
      destination: {lat: restaurant.latitude, lng: restaurant.longitude},
      travelMode: google.maps.DirectionsTravelMode['DRIVING'],
      optimizeWaypoints: true
    };

    $scope.restaurantMarkers.push({id: Date.now(),
      coords:{latitude:$scope.currentLocation.latitude, longitude:$scope.currentLocation.longitude}
    });
    direction.route(request, function(response, status){
      var steps = response.routes[0].legs[0].steps;
      var distance =response.routes[0].legs[0].distance.value/100;
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
        $scope.restaurantMarkers[0].icon = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=restaurant|edge_bc|FFBB00|000000|'
            + restaurant.name +'|Distance: '+ distance + 'km');

        $scope.$apply();
    });
  };


}]);
