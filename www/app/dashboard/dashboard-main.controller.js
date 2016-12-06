app.controller("DashboardMainCtrl", ["$scope", "$state", "$stateParams", "$ionicModal", "$ionicPopup", "restaurant", "Restaurant", "Database",
  function($scope, $state, $stateParams, $ionicModal, $ionicPopup, restaurant, Restaurant, Database) {

    $scope.restaurant = restaurant;
    $scope.getFacilityName = Restaurant.getFacilityName;

    $scope.showDelete = function(restaurant) {
      var deletePopup = $ionicPopup.confirm({
        title: 'Sure to delete?',
        cssClass: 'custom-popup',
        scope: $scope
      })
        .then(function(res) {
          if (res) {
            $scope.deleteRestaurant(restaurant);
          }
        })
    };

    $scope.deleteRestaurant = function(restaurant) {
      var resObj = restaurant;
      Restaurant.delete(restaurant.$id)
        .then(() => {
          console.log('Success deleting ');
        })
        .catch((err) => {
          console.log('Error on deleting: '+err);
        })
      // for (var menu in resObj.menus) {
      //   var menusRef = firebase.database().ref().child('menus');
      //   menusRef.child(menu).set(null);
      // }
      //
      // for (var review in resObj.reviews) {
      //   var reviewsRef = firebase.database().ref().child('reviews');
      //   reviewsRef.child(review).set(null);
      // }
      //
      // for (var reviewer in resObj.reviewers) {
      //   var userReviewedRestaurantsRef = firebase.database().ref().child('users').child(reviewer).child('reviewed_restaurants');
      //   console.log('reviewer ref' + userReviewedRestaurantsRef);
      //   userReviewedRestaurantsRef.child(resObj.$id).set(null);
      // }
      Database.restaurantMenusReference().child(resObj.$id).remove();

      Database.restaurantReservationsReference().child(resObj.$id).once('value')
        .then((snapshot) => {
          for (var reservation in snapshot.val()) {
            console.log(reservation);
            Reservation.delete(reservation)
              .then(() => {
                console.log('delete sucess')
                alert('delete success');
              })
              .catch((err) => {
                console.log(err)
                alert(err);
              })
          }
        })

      Database.restaurantOrdersReference().child(resObj.$id).once('value')
        .then((snapshot) => {
          for (var order in snapshot.val()) {
            console.log(order);
            Order.delete(order)
              .then(() => {
                console.log('success')
              })
              .catch((err) => {
                console.log(err)
                alert(err);
              })
          }
        })
      $state.go('tabs.restaurant');
    }

    $scope.editRestaurant = function(restaurant) {
      $scope.eRestaurant = {
        $id: restaurant.$id,
        name: restaurant.name,
        phonenumber: parseInt(restaurant.phonenumber),
        type: restaurant.type,
        cuisine: restaurant.cuisine,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
        openDays: restaurant.openDays,
        facilities: restaurant.facilities,
        location: restaurant.location,
        photoURL: restaurant.photoURL
      };
      $scope.restaurantEditModal.show();
      if (restaurant.photoURL) {
        $scope.imageURL = restaurant.photoURL;
      } else {
        $scope.imageURL = null;
      }
      $scope.restaurantName = restaurant.name;
      $scope.marker.coords = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
      };
    }

    $scope.edit = function(restaurant) {
      $ionicLoading.show();
      Restaurant.editRestaurant(restaurant, $scope.marker, $scope.imageURL)
        .then(function() {
          $scope.imageURL = null;
          $ionicLoading.hide();
          $scope.restaurantEditModal.hide();
        })
    }

    $scope.closeEditRestaurant = function() {
        $scope.restaurantEditModal.hide();
        $scope.imageURL = null;
    }



    $ionicModal.fromTemplateUrl('app/restaurant/_edit-restaurant.html', function(restaurantEditModal) {
      $scope.restaurantEditModal = restaurantEditModal;
    }, {
      scope: $scope
    });




  }
]);
