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


app.controller("RestaurantCtrl", ["$scope", "$firebaseArray", "$firebaseAuth", "User", "$ionicModal", "$ionicListDelegate",
function($scope, $firebaseArray, $firebaseAuth, User, $ionicModal, $ionicListDelegate){

  var ref = firebase.database().ref().child("restaurants");
  $scope.restaurants = $firebaseArray(ref);
  var resRef = firebase.database().ref().child("restaurants").orderByChild("owner_id").equalTo(User.auth().$id);

  $scope.displayRestaurants = $firebaseArray(resRef);
  $scope.AppUser = User.auth();
  console.log($scope.AppUser.$id);

  // console.log("initialized res ctrl: "+cUser.uid);

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
      owner_id: User.auth().$id
    })

    $scope.restaurantModal.hide();
    restaurant.name = "";
    restaurant.location = "";
    restaurant.type = "";
    restaurant.cuisine = "";
  }

  $scope.edit = function(restaurant){
    $scope.restaurants.$save({
      name: restaurant.name,
      location: restaurant.location,
      type: restaurant.type,
      cuisine: restaurant.cuisine
    })

    $scope.restaurantEditModal.hide();
    $ionicListDelegate.closeOptionButtons();
  }

  $ionicModal.fromTemplateUrl('templates/new-restaurant.html', function(modalRestaurant) {
    $scope.restaurantModal = modalRestaurant;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/edit-restaurant.html', function(modalEditRestaurant) {
    $scope.restaurantEditModal = modalEditRestaurant;
  }, {
    scope: $scope
  });

  $scope.editRestaurant = function(restaurant){
    console.log("HELLO WORLD EDIT CLICKED");
    $scope.restaurant = restaurant;
    $scope.restaurantEditModal.show();
  }

  $scope.closeEditRestaurant = function() {
    $scope.restaurantEditModal.hide();
  }

  $scope.newRestaurant = function() {
    $scope.restaurantModal.show();
  };

  $scope.closeRestaurant = function() {
    $scope.restaurantModal.hide();
  }



}])
