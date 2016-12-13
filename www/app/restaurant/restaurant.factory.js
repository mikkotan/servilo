app.factory("Restaurant",["$firebaseArray", "User", "Database", "$firebaseObject", "$q",
  function($firebaseArray, User, Database, $firebaseObject, $q){

  var restaurants = Database.restaurantsReference();
  var users = Database.usersReference();
  var menus = Database.menusReference();
  var reviews = Database.reviewsReference();
  var orders = Database.ordersReference();
  var restaurantOrders = Database.restaurantOrdersReference();
  var restaurantsArray = Database.restaurants();
  var restaurantReviews = Database.restaurantReviewsReference();
  var facilities = $firebaseArray(Database.facilitiesReference());

  var Restaurant = {
    all : function() {
        return Database.restaurants();
    },
    getAuthUserRestaurants : function() {
      var authUserId = User.auth().$id;
      return $firebaseArray(restaurants.orderByChild("owner_id").equalTo(authUserId))
    },
    get : function(restaurantId) {
      return $firebaseObject(Database.restaurantsReference().child(restaurantId));
    },
    getPendingRestaurants : function() {
      return Database.pendings();
      // return $firebaseArray(Database.pendingsReference())
    },
    getAverageRating : function(restaurantId) {
      console.log('getting averge rating to ' + restaurantId);
      return Database.restaurantReviewsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          var total = 0
          var count = 0
          var reviews = snapshot.val();
          for (var key in reviews) {
            count ++;
            total += reviews[key].rating
          }
          if (count === 0) {
            return (0).toFixed(1);
          } else {
            return (total/count).toFixed(1);
          }
        })
    },
    getMenus : function(restaurantId) {
      return $firebaseArray(Database.restaurantMenusReference().child(restaurantId));
    },
    getRestaurantStatus : function(ownerId) {
      return Database.usersReference().child(ownerId).child("online");
    },
    getRestaurant : function(restaurantId) {
      return $firebaseArray(restaurants.child(restaurantId));
    },
    getRestaurantRef : function(restaurantId) {
      return restaurants.child(restaurantId);
    },
    getRestaurantName : function(restaurantId) {
      return Database.restaurantsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          return snapshot.val().name
        })
    },
    getReservations : function(restaurantId) {
      return $firebaseArray(Database.restaurantReservationsReference().child(restaurantId));
    },
    // getOrders : function(restaurantId) {
    //   console.log('getting orders in restaurant factory');
    //   return $firebaseArray(restaurantOrders.child(restaurantId))
    // },
    getReviews : function(restaurantId) {
      // return $firebaseArray(reviews.orderByChild('restaurant_id').equalTo(restaurantId));
      return $firebaseArray(restaurantReviews.child(restaurantId).limitToLast(5))
    },
    getOwner : function(restaurantId) {
      // console.log('get owner method');
      // return $firebaseObject(users.child(ownerId));
      console.log(restaurantId);
      var res = restaurantsArray.$getRecord(restaurantId);
      console.log(res);
      return $firebaseObject(users.child(res.owner_id))
    },
    getOrders : function(restaurantId) {
      return $firebaseArray(restaurantOrders.child(restaurantId));
    },
    getRestaurantOpenStatus : function(restaurant) {
      // var restaurant = $firebaseObject(restaurants.child(restaurantId));
      // var restaurant = restaurants.$getRecord(restaurantId);
      var restaurantOpenTime = new Date(restaurant.openTime);
      var restaurantCloseTime = new Date(restaurant.closeTime);
      var openTime = new Date();
      var closeTime = new Date();
      var now = new Date();
      console.log("isOpenToday? "+ restaurant.openDays[now.getDay()]);
      console.log(JSON.stringify(restaurant.openDays[0], null, 4));

      openTime.setHours(restaurantOpenTime.getHours(), restaurantOpenTime.getMinutes());
      closeTime.setHours(restaurantCloseTime.getHours(), restaurantCloseTime.getMinutes());
      if (restaurant.openDays[now.getDay()]) {
        if(openTime.getTime() > closeTime.getTime()) {
          closeTime.setDate(closeTime.getDate() + 1);
        }

        if(openTime.getTime() < now.getTime() && now.getTime() < closeTime.getTime()) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    getTimestamp : function(restaurantKey) {
      return restaurants.child(restaurantKey).child('timestamp');
    },
    getLocationName : function(latitude, longitude) {
      var deferred = $q.defer();
      var geocoder = new google.maps.Geocoder;
      var latLng = {
        lat: latitude,
        lng: longitude
      };
      console.log(latLng);
      geocoder.geocode({
        'location': latLng
      }, function(results, status) {
        if (status === 'OK') {
          console.log('oks');
          deferred.resolve(results[0].formatted_address);
          // $scope.$apply();
        } else {
          console.log('nonono');
          deferred.resolve(null);
          alert('Geocoder failed due to: ' + status);
        }
      });
      return deferred.promise;
    },
    getPromos : function(restaurantId) {
      // var now = new Date()
      // now.setHours(0)
      // now.setMinutes(0)
      // now.setSeconds(0)
      // now.setMilliseconds(0)
      // console.log("now start gettime "+now.getTime())
      // now.setHours(23)
      // console.log("now end gettime "+now.getTime())
      return $firebaseArray(Database.promosReference().child(restaurantId))
    },
    getFacilityName : function(facilityId) {
      return facilities.$getRecord(facilityId).name;
    },
    getMarker : function(latitude, longitude) {
      return marker = {
        id: Date.now(),
        coords: {
          latitude: latitude,
          longitude: longitude
        }
      }
    },
    //kind of service
    changeServiceStatus : function(restaurant, service) {
      var resRef = restaurants.child(restaurant.$id).child('services').child(service.name);
      return resRef.update({
        status: service.status
      })
    },
    changeAvailability : function(restaurant) {
      var resRef = restaurants.child(restaurant.$id);
      return resRef.update({
        availability: restaurant.availability
      })
    },
    addCategory : function(category) {
      var categoryRef = restaurants.child(category.restaurant_id).child('menu_categories').push();
      return categoryRef.set({
        name: category.name
      })
    },
    addRestaurant : function(restaurant) {
      delete restaurant['$id'];
      delete restaurant['$priority'];
      delete restaurant['$$hashKey'];
      var key = restaurants.push().key;
      var restaurantRef = restaurants.child(key);
      return {
        ref: restaurantRef.set(restaurant),
        key: key
      }
    },
    addPendingRestaurant : function(restaurant, marker, imageURL) {
      var restObj = {
        name: restaurant.name.toLowerCase(),
        facilities: restaurant.facilities,
        openDays: restaurant.openDays,
        location: restaurant.location,
        latitude: marker.coords.latitude,
        longitude: marker.coords.longitude,
        type: restaurant.type,
        cuisine: restaurant.cuisine,
        owner_id: User.auth().$id,
        photoURL: imageURL,
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
      }
      var pendingRef = Database.pendingsReference().push();
      return pendingRef.set(restObj);
    },
    editRestaurant : function(restaurant, marker, imageURL) {
      console.log(JSON.stringify(restaurant, null, 4));
      var resRef = restaurants.child(restaurant.$id);
      var OT = new Date(restaurant.openTime);
      var CT = new Date(restaurant.closeTime);
      var restObj = {
        name: restaurant.name,
        location: restaurant.location,
        latitude: marker.coords.latitude,
        longitude: marker.coords.longitude,
        facilities: restaurant.facilities,
        openDays: restaurant.openDays,
        type: restaurant.type,
        cuisine: restaurant.cuisine,
        photoURL: imageURL,
        phonenumber: restaurant.phonenumber,
        openTime: OT.getTime(),
        closeTime: CT.getTime()
      }
      return resRef.update(restObj);
    },
    delete: function(restaurantId) {
      return Database.restaurantsReference().child(restaurantId).remove()
    },
    //////////////repeated functions
    openReplyModal : function($scope, review) {
      $scope.reply = {};
      console.log('new reply')
      $scope.newReply = true;
      $scope.replyTitle = "New Reply";
      $scope.reply.content = "";
      $scope.addReplyModal.show();
      $scope.reviewId = review.$id;
    },
    openEditReplyModal : function($scope, reply, reviewId, restaurantId) {
      $scope.newReply = false;
      $scope.replyTitle = "Edit Reply";
      $scope.addReplyModal.show();
      $scope.reply = {
        content: reply.content,
        $id: reply.$id,
        oldContent: reply.content,
        user_id: reply.user_id,
        reviewId: reviewId,
        restaurantId: restaurantId
      }
    }
  }

  return Restaurant;
}]);
