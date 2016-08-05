app.controller('HomeTabCtrl', ["$scope","$ionicModal",
"$firebaseArray","currentAuth", "Restaurant", "Home" ,"$stateParams", "$state", "User", "$firebaseObject",
function($scope, $ionicModal, $firebaseArray, currentAuth, Restaurant, Home, $stateParams, $state, User, $firebaseObject) {
  console.log('HomeTabCtrl');


    $scope.rating = {
      rate : 0,
      max: 5
    }

    $scope.$watch('rating.rate', function() {
      console.log('New value: '+$scope.rating.rate);
    });

    $scope.restaurants = Restaurant.all();
    $scope.getUserName = Home.getUserName;
    var id = $stateParams.restaurantId;
    var reviewRef = firebase.database().ref("restaurants/"+id+"/reviews");
    $scope.reviews = $firebaseArray(reviewRef);

    // Home.getUserName(User.auth().$id).$loaded().then(function(user){
    //   console.log("HELLO TRY USER: "+user.firstName);
    // })

    var userRfe = firebase.database().ref().child('users');
    $scope.userRfeObj = $firebaseArray(userRfe);
    console.log("HERE SAMPLE")
    console.log("Sample user"+ $scope.userRfeObj);

    // console.log("HELLO TRY USER2: "+Home.getUserName(User.auth().$id).$loaded());

    if($state.is("tabs.viewRestaurant")){
    $scope.restaurant = Restaurant.get(id);
    console.log(id)
    }

    $scope.addReview = function(review) {
      console.log("added review");
      $scope.reviews.$add({
        content: review.content,
        rating: review.rating,
        reviewer_id: User.auth().$id
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


}]);
