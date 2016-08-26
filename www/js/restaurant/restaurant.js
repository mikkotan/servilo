app.controller("RestaurantCtrl", ["$scope", "$firebaseArray", "$firebaseAuth", "User", "$ionicModal", "$ionicListDelegate", "Restaurant", "$cordovaCamera",
  function($scope, $firebaseArray, $firebaseAuth, User, $ionicModal, $ionicListDelegate, Restaurant, $cordovaCamera){
  $scope.modalControl = {};
  $scope.restaurants = Restaurant.all();
  $scope.pendingRestaurants = Restaurant.getPendingRestaurants();
  $scope.displayRestaurants = Restaurant.getAuthUserRestaurants();
  $scope.openRestaurant = Restaurant.getRestaurantOpenStatus;
  // $scope.getRestaurantPriceRange = Restaurant.getRestaurantPriceRange;
  $scope.AppUser = User.auth();
  $scope.restaurant = {
    openTime : new Date()
  }
  $scope.$watch('openTime', function() {
    console.log('New value: '+$scope.openTime);
  });
  // var user = User.auth();
  console.log($scope.AppUser)
  // user.$loaded().then(function() {
  //   if(user.displayName == undefined) {
  //     $scope.AppUser = user.firstName + " " + user.lastName;
  //   }
  //   else {
  //     console.log(user)
  //     $scope.AppUser = user.displayName;
  //   }
  // })

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User:"+user.uid);
    } else {
      console.log("NOT LOGGED IN");
    }
  });

  $scope.images = [];
  // var hehe = firebase.database().ref().child('pictures');
  // var syncArray = $firebaseArray(hehe);
  // $scope.images = syncArray;
  $scope.imageURL = "";
  $scope.upload = function(index) {
    var source = "";
    switch(index) {
      case 1:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 2:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : source,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imageURL = imageData;
      // console.log(imageData);
        // syncArray.$add({image: imageData}).then(function() {
        //     alert("Image has been uploaded");
        // });

    }, function(error) {
        console.error(error);
    });
  }

  $scope.addRestaurant = function(restaurant){
    $scope.pendingRestaurants.$add({
      name: restaurant.name,
      location: restaurant.location,
      latitude: $scope.marker.coords.latitude,
      longitude: $scope.marker.coords.longitude,
      type: restaurant.type,
      cuisine: restaurant.cuisine,
      owner_id: User.auth().$id,
      sumPrice: 0,
      totalMenuCount: 0,
      sumRating: 0,
      totalRatingCount: 0,
      avgRate: 0,
      image: $scope.imageURL,
      openTime: restaurant.openTime.getTime(),
      closeTime: restaurant.closeTime.getTime()
    })

    $scope.restaurantModal.hide();
    restaurant.name = "";
    restaurant.location = "";
    restaurant.type = "";
    restaurant.cuisine = "";
  }

  $scope.edit = function(restaurant){
    var resRef = firebase.database().ref().child("restaurants").child(restaurant.$id);
    resRef.update({
      name: restaurant.name,
      location: restaurant.location,
      latitude: $scope.marker.coords.latitude,
      longitude: $scope.marker.coords.longitude,
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
    $scope.showMap = false;
    $scope.restaurant = restaurant;
    $scope.restaurantEditModal.show();
    $scope.marker.coords = {latitude: restaurant.latitude, longitude: restaurant.longitude};
    $scope.modalControl.refresh({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    });
  }

  $scope.closeEditRestaurant = function() {
    $scope.restaurantEditModal.hide();
  }

  $scope.newRestaurant = function() {
    $scope.restaurantModal.show();
    $scope.modalControl.refresh({
      latitude: 10.73016704689235,
      longitude: 122.54616022109985
    });
  };

  $scope.closeRestaurant = function() {
    $scope.restaurantModal.hide();
  }

  $scope.approveRestaurant = function(restaurant) {
    $scope.pendingRestaurants.$remove(restaurant).then(function() {
      console.log("try rest own id "+restaurant.owner_id);
      $scope.restaurants.$add(restaurant);
    })
  }

  $scope.marker ={id: 0};
  $scope.map = {
    center: { latitude: 10.73016704689235, longitude: 122.54616022109985 },
    zoom: 14, options: {scrollwheel: false},
    bounds: {},
    events: {
      click: function (map, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        var lat = e.latLng.lat(),lon = e.latLng.lng();
        var m = {
          id: Date.now(),
          coords: {
            latitude: lat,
            longitude: lon
          }
        };
        $scope.marker = m;
        $scope.$apply();
      }
    }
  };
}])
