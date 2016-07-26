// app.controller("RestaurantCtrl",["$scope","$firebaseArray","$firebaseAuth", "AppUser",
// function($scope, $firebaseArray, $firebaseAuth,AppUser){

  // var ref = firebase.database().ref().child('restaurants');
  // $scope.restaurants = $firebaseArray(ref);
  // $scope.AppUser = firebase.auth().currentUser.uid;
  // console.log($scope.AppUser);
  // console.log("INIT Restaurant");
  // $scope.addRestaurant = function(restaurant){
  //   $scope.restaurants.$add({
  //     name: restaurant.name,
  //     owner:
  //   })
//   }
// }])

app.controller("RestaurantCtrl", ["$scope", "$firebaseArray", "$firebaseAuth", "AuthUser", "$ionicModal",
function($scope, $firebaseArray, $firebaseAuth, AuthUser, $ionicModal){
  var cUser = firebase.auth().currentUser;
  var ref = firebase.database().ref().child("restaurants/"+AuthUser.$id);
  $scope.restaurants = $firebaseArray(ref);
  $scope.AppUser = AuthUser;
  console.log($scope.AppUser.$id);
  console.log("initialized res ctrl: "+cUser.uid);

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("User:"+user.uid);
  } else {
    // No user is signed in.
    console.log("NOT LOGGED IN");

  }
});




  $scope.addRestaurant = function(restaurant){
    $scope.restaurants.$add({
      name: restaurant.name,
      location: restaurant.location,
      type: restaurant.type,
      cuisine: restaurant.cuisine,
    })

    $scope.restaurantModal.hide();
    restaurant.name = "";
    restaurant.location = "";
    restaurant.type = "";
    restaurant.cuisine = "";
  }

  $ionicModal.fromTemplateUrl('templates/new-restaurant.html', function(modalRestaurant) {
    $scope.restaurantModal = modalRestaurant;
  }, {
    scope: $scope
  });

  $scope.newRestaurant = function() {
    $scope.restaurantModal.show();
  };

  $scope.closeRestaurant = function() {
    $scope.restaurantModal.hide();
  }

}])
