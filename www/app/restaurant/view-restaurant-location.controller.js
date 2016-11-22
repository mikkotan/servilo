app.controller("ViewRestaurantLocation", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "Database", "$ionicLoading", "$ionicModal", "$ionicPopup", "$cordovaGeolocation", "$stateParams", "Restaurant", "User", "Review", "Reservation", "$ionicLoading",
  function($scope, $state, $firebaseArray, $firebaseObject, Database, $ionicLoading, $ionicModal, $ionicPopup, $cordovaGeolocation, $stateParams, Restaurant, User, Review, Reservation, $ionicLoading) {

var id = $stateParams.restaurantId;
 $scope.restaurant = Restaurant.get(id);
  $scope.mapDirection = [];
  $scope.currentLocation = {};
  $scope.restaurantMarkers = [];
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

  $scope.setMap = function(restaurant) {
    $scope.map = {
      center: {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
      },
      zoom: 14,
      options: {
        scrollwheel: false
      },
      bounds: {},
      events: {
        tilesloaded: function(map) {
          $scope.$apply(function() {
            google.maps.event.trigger(map, "resize");
          });
        }
      }
    };
    $scope.restaurantMarkers.push({
      id: Date.now(),
      coords: {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
      }
    });
  };

  $scope.markerEvents = {
    click: function(marker, eventName, model) {
      $state.go("tabs.viewRestaurant", {
        restaurantId: model.id
      });
    }
  };

  $scope.showPath = function(restaurant) {
    $scope.map.zoom = 12;
    var mapDirection = new google.maps.DirectionsService();
    var request = {
      origin: {
        lat: $scope.currentLocation.latitude,
        lng: $scope.currentLocation.longitude
      },
      destination: {
        lat: restaurant.latitude,
        lng: restaurant.longitude
      },
      travelMode: google.maps.DirectionsTravelMode['DRIVING'],
      optimizeWaypoints: true
    };

    $scope.restaurantMarkers.push({
      id: Date.now(),
      coords: {
        latitude: $scope.currentLocation.latitude,
        longitude: $scope.currentLocation.longitude
      }
    });

    mapDirection.route(request, function(response, status) {
      var steps = response.routes[0].legs[0].steps;
      var distance = response.routes[0].legs[0].distance.value / 1000;
      distance = distance.toFixed(2);
      for (i = 0; i < steps.length; i++) {
        var strokeColor = '#049ce5';
        if ((i % 2) == 0) {
          strokeColor = '#FF9E00';
        }
        $scope.mapDirection.push({
          id: i,
          paths: steps[i].path,
          stroke: {
            color: strokeColor,
            weight: 5
          }
        });
      }
      $scope.restaurantMarkers[0].icon = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=restaurant|edge_bc|FFBB00|000000|' +
        restaurant.name + '|Distance: ' + distance + 'km');
      $scope.$apply();
    });
  };
}
])
