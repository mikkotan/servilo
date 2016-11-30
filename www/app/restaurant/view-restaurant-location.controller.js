app.controller("ViewRestaurantLocation", ["$scope", "$state", "$ionicModal", "CordovaGeolocation", "currentGeoLocation",
  function($scope, $state, $ionicModal, CordovaGeolocation, currentGeoLocation) {
  $scope.modalControl ={};
  $scope.mapDirection = [];
  // $scope.currentLocation = CordovaGeolocation.get();
  $scope.restaurantMarkers = [];

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
    $scope.placeName(restaurant);
    $scope.getDistance(restaurant,'DRIVING');
    $scope.getDistance(restaurant,'WALKING');

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

  $scope.showPath = function(restaurant, mode) {
    $scope.map.zoom = 12;
    $scope.currentLocation = CordovaGeolocation.get();
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
      travelMode: google.maps.DirectionsTravelMode[mode],
      optimizeWaypoints: true
    };
    $scope.restaurantMarkers.length = 1;

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

  //function that converts LatLng coordinates to word
  $scope.placeName = function(restaurant){
    var geocoder = new google.maps.Geocoder;
    var latLng = {lat: restaurant.latitude, lng: restaurant.longitude};
    geocoder.geocode({'location': latLng}, function(results, status) {
      if (status === 'OK') {
        $scope.location = results[0].formatted_address;
        $scope.$apply();
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }
  //getting the distance
  $scope.getDistance = function(restaurant, mode) {
    $scope.currentLocation = CordovaGeolocation.get();
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
      travelMode: google.maps.DirectionsTravelMode[mode],
      optimizeWaypoints: true
    };

    mapDirection.route(request, function(response, status) {
      var distance = response.routes[0].legs[0].distance.value / 1000;
      distance = distance.toFixed(2);
      if(mode == "DRIVING"){
          $scope.drivingD = distance;
      }else{
        $scope.walkingD = distance;
      };
      $scope.$apply();
    });
  };

  $ionicModal.fromTemplateUrl('app/restaurant/_view-map-restaurant-location.html', function(mapModal) {
    $scope.mapModal = mapModal;
  }, {
    scope: $scope
  });

  $scope.openMapModal = function(restaurant){
    $scope.mapModal.show();
    $scope.modalControl.refresh({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    });
  }
}])
