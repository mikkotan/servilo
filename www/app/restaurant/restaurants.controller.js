
app.controller("RestaurantCtrl", ["$scope", "$firebaseArray", "$firebaseAuth", "User", "$ionicModal", "$ionicListDelegate",
  "Restaurant", "$cordovaCamera", "$cordovaGeolocation", "Restaurant",
  function($scope, $firebaseArray, $firebaseAuth, User, $ionicModal, $ionicListDelegate, Restaurant, $cordovaCamera, $cordovaGeolocation, Restaurant) {

    var total = 123;
    $scope.modalControl = {};
    $scope.restaurants = Restaurant.all();
    $scope.pendingRestaurants = Restaurant.getPendingRestaurants();
    // $scope.displayRestaurants = Restaurant.getAuthUserRestaurants();
    $scope.displayRestaurants = User.getAuthRestaurants();
    $scope.AppUser = User.auth();
    $scope.restaurant = {
      openTime: new Date()
    }

    console.log($scope.AppUser)


    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User:" + user.uid);
      } else {
        console.log("NOT LOGGED IN");
      }
    });

  $scope.changeServiceStatus = function(restaurant,service){
    var resRef = Database.restaurantsReference().child(restaurant.$id).child('services').child(service.name);
    resRef.update({
        status : service.status
    })
  };

  $scope.changeAvailability = function(restaurant){
    var resRef = Database.restaurantsReference().child(restaurant.$id);
    resRef.update({
      availability: restaurant.availability
    })
  }

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
      var d = new Date();
      var child = 'restaurants/' + d.getTime() + '.jpg';
      var storageRef = firebase.storage().ref();
      var mountainsRef = storageRef.child(child).putString(imageData, 'base64', metadata);
      mountainsRef.on('state_changed', function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        $scope.progress = progress;
      }, function(error) {
        console.log("error in uploading." + error);
      }, function() {
        //success upload
        $scope.imageURL = mountainsRef.snapshot.downloadURL;
      });

      }, function(error) {
        console.error(error);
      });
  }
  var metadata = {
    contentType: 'image/jpeg',
  };

  $scope.addRestaurant = function(restaurant){
    $scope.pendingRestaurants.$add({
      name: restaurant.name,
      services : {
        online : {
          name : "online",
          status : false
        },
        reserve : {
          name : "reserve",
          status : false
        },
        cater : {
          name : "cater",
          status : false
        }
      },
      facilities : restaurant.facilities,
      location: restaurant.location,
      latitude: $scope.marker.coords.latitude,
      longitude: $scope.marker.coords.longitude,
      type: restaurant.type,
      cuisine: restaurant.cuisine,
      owner_id: User.auth().$id,
      photoURL: $scope.imageURL,
      phonenumber: restaurant.phonenumber,
      openTime: restaurant.openTime.getTime(),
      closeTime: restaurant.closeTime.getTime(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      secured_data: {
        sumPrice: 0,
        totalMenuCount: 0,
        avgPrice: 0,
        sumRating: 0,
        totalRatingCount: 0,
        avgRate: 0
      }
    })
    .then(() => {
      for (var facility in restaurant.facilities) {
        console.log(facility);
      }
    })

    restaurant.name = "";
    restaurant.location = "";
    restaurant.type = "";
    restaurant.cuisine = "";
    restaurant.phonenumber = "";
    restaurant.closeTime = "";
    $scope.imageURL = null;
    $scope.progress = null;
    $scope.restaurantModal.hide();
  }

  $scope.edit = function(restaurant) {
    var resRef = firebase.database().ref().child("restaurants").child(restaurant.$id);
    var OT = new Date(restaurant.openTime);
    var CT = new Date(restaurant.closeTime);
    resRef.update({
      name: restaurant.name,
      location: restaurant.location,
      latitude: $scope.marker.coords.latitude,
      longitude: $scope.marker.coords.longitude,
      type: restaurant.type,
      cuisine: restaurant.cuisine,
      photoURL: $scope.imageURL,
      phonenumber: restaurant.phonenumber,
      openTime: OT.getTime(),
      closeTime: CT.getTime(),
    }).then(function() {
      $scope.imageURL = null;
    })

    $scope.restaurantEditModal.hide();
    $ionicListDelegate.closeOptionButtons();
  }

  $ionicModal.fromTemplateUrl('app/restaurant/_new-restaurant.html', function(restaurantModal) {
    $scope.restaurantModal = restaurantModal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('app/restaurant/_edit-restaurant.html', function(restaurantEditModal) {
    $scope.restaurantEditModal = restaurantEditModal;
  }, {
    scope: $scope
  });


  $scope.deleteRestaurant = function(restaurant) {
    var resObj = restaurant;
    console.log(resObj);
    $scope.displayRestaurants.$remove(resObj).then(function() {
      console.log('deleted?');
    });

    for(var menu in resObj.menus) {
      console.log(menu);
      var menusRef = firebase.database().ref().child('menus');
      menusRef.child(menu).set(null);
    }

    for(var review in resObj.reviews) {
      console.log(review);
      var reviewsRef = firebase.database().ref().child('reviews');
      reviewsRef.child(review).set(null);
    }

    for(var reviewer in resObj.reviewers) {
      console.log(reviewer);
      var userReviewedRestaurantsRef = firebase.database().ref().child('users').child(reviewer).child('reviewed_restaurants');
      console.log('reviewer ref'+userReviewedRestaurantsRef);
      userReviewedRestaurantsRef.child(resObj.$id).set(null);
    }

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
  }

  $scope.editRestaurant = function(restaurant) {
    $scope.restaurantEditModal.show();
    $scope.showMap = false;
    $scope.eRestaurant = restaurant;
    $scope.imageURL = restaurant.photoURL;
    $scope.restaurantName = restaurant.name;
    $scope.marker.coords = {
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    };
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

  $scope.approveRestaurant = function(restaurant) {
    $scope.pendingRestaurants.$remove(restaurant)
    .then(() => {
      $scope.restaurants.$add(restaurant)
        .then((restaurantObject) => {
          var resRef = firebase.database().ref().child('restaurants').child(restaurantObject.key).child('timestamp');
          var resObj = Restaurant.get(restaurantObject.key);
          for (var facility in resObj.facilities) {
            var facilityRef = firebase.database().ref().child('facilities').child(facility).child('restaurants').child(restaurantObject.key);
            facilityRef.set(true);
          }
          resRef.transaction(function(currentTimestamp) {
            var lolpe = firebase.database.ServerValue.TIMESTAMP;
            console.log('hello old timestamp ' + currentTimestamp);
            console.log('hello new timestamp ' + firebase.database.ServerValue.TIMESTAMP);
            return lolpe;
          })
        })
        .catch((err) => { console.log(err) })
    })
    .catch((err) => { console.log(err) })
  }

  $scope.marker = {
    id: 0
  };

  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
    $scope.currentLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  });

  $scope.map = {
    center: {
      latitude: 10.73016704689235,
      longitude: 122.54616022109985
    },
    zoom: 14,
    options: {
      scrollwheel: false
    },
    bounds: {},
    events: {
      click: function(map, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        var lat = e.latLng.lat(),
          lon = e.latLng.lng();
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
  $scope.markLocation = function() {
    $scope.marker = {
      id: Date.now(),
      coords: {
        latitude: $scope.currentLocation.latitude,
        longitude: $scope.currentLocation.longitude
      }
    };
    $scope.map.center = {
      latitude: $scope.currentLocation.latitude,
      longitude: $scope.currentLocation.longitude
    };
  }

  // $scope.facilities = [
  //   {
  //     id : 'Wifi',
  //     name : 'Wifi Hotspot'
  //   },
  //   {
  //     id: 'Parking',
  //     name: 'Parking Area'
  //   },
  //   {
  //     id: 'Reservation',
  //     name: 'Accepts Reservation'
  //   }
  // ];

  // $scope.facilities = {
  //   "Wifi" : {
  //     name : "Wifi Hotspot"
  //   },
  //   "Parking" : {
  //     name : "Parking Area"
  //   },
  //   "Reservation" : {
  //     name : "Accepts Reservation"
  //   }
  // }
  $scope.facilities = $firebaseArray(firebase.database().ref().child('facilities'));
  $scope.itemArray = [
        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'},
    ];

  $scope.selected = { value: $scope.itemArray[0] };




}])
