app.factory("Search", ["$firebaseObject", "$firebaseAuth", "$firebaseArray", "Database", "CordovaGeolocation",
  function($firebaseObject, $firebaseAuth, $firebaseArray, Database, CordovaGeolocation) {

    var menusRef = Database.menusReference();
    var restaurantsRef = Database.restaurantsReference();
    var usersRef = Database.usersReference();

    var calculateDistance = function(point1, point2) {
      return (google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000).toFixed(2);
    };

    return {
      // restaurants : function(){
      //   return $firebaseArray(restaurant);
      // },
      // getRestaurant : function(restaurantId){
      //   return $firebaseObject(restaurant.child(restaurantId));
      // },
      searchName: function(input) {
        var query = restaurantsRef.orderByChild('name').startAt(input).endAt(input + "\uf8ff");
        return $firebaseArray(query);
      },
      searchMenu: function(input) {
        var query = menusRef.orderByChild('name').startAt(input).endAt(input + "\uf8ff");
        return query;
      },
      getRestaurants: function(id) {
        var query = restaurantsRef.child(id);
        return $firebaseObject(query);
      },
      getRestaurant: function() {
        // return $firebaseArray(restaurantsRef);
        return restaurantsRef;
      },
      getNear: function(id, restaurant) {
        var currentLocation = CordovaGeolocation.get();
        var marker = {
          id: id,
          coords: {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
          }
        }
        var point1 = new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude);
        var point2 = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
        if (calculateDistance(point1, point2) <= 1) {
          restaurant["$id"] = id;
          return {
            marker: marker,
            restaurant: restaurant
          };
        }
      },
      getNearLocation: function(id, restaurant, lat, long) {
        var currentLocation = CordovaGeolocation.get();
        var marker = {
          id: id,
          coords: {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
          }
        }
        var point1 = new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude);
        var point2 = new google.maps.LatLng(lat, long);
        if (calculateDistance(point1, point2) <= 1) {
          restaurant["$id"] = id;
          return {
            marker: marker,
            restaurant: restaurant
          };
        }
      },
      getNearestRestaurants: function(restaurants) {
        var currentLocation = CordovaGeolocation.get();
        var tempMarkers = [];
        var markers = [];
        for (var i = 0; i < restaurants.length; i++) {
          markers.push({
            id: restaurants[i].$id,
            coords: {
              latitude: restaurants[i].latitude,
              longitude: restaurants[i].longitude
            },
            data: restaurants[i]
          });
        }
        for (var i = 0; i < markers.length; i++) {
          var p1 = new google.maps.LatLng(markers[i].coords.latitude, markers[i].coords.longitude);
          var p2 = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
          if (calculateDistance(p1, p2) <= 1) {
            tempMarkers.push({
              id: markers[i].id,
              coords: markers[i].coords,
              data: markers[i].data
            });
          }
        }
        markers.length = 0;
        markers = tempMarkers;
        markers.push({
          id: 0,
          coords: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          },
          icon: {
            url: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=glyphish_user|edge_bc|FFBB00|000000|You+Are+Here',
            scaledSize: new google.maps.Size(83, 30)
          }
        });
        return markers;
      },
      getMap: function() {
        var map = {
          center: {
            latitude: 10.729984,
            longitude: 122.549298
          },
          zoom: 12,
          options: {
            scrollwheel: false
          },
          bounds: {},
          control: {},
          refresh: true,
          events: {
            tilesloaded: function(map) {
              // $scope.$apply(function () {
              google.maps.event.trigger(map, "resize");
              // });
            }
          }
        };
        return map;
      },
      getMarker: function(item) {
        var marker = {
            id: item.$id,
            coords: {
              latitude: item.latitude,
              longitude: item.longitude
            }
          }
          // var markers = [];
          // for (var i = 0; i < items.length; i++) {
          //   markers.push({
          //     id: items[i].$id,
          //     coords: {
          //       latitude:items[i].latitude,
          //       longitude:items[i].longitude
          //     }
          //   });
          // }
        return marker;
      },
      getYouAreHere: function() {
        var currentLocation = CordovaGeolocation.get();
        var location = {
          id: 0,
          coords: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          },
          icon: {
            url: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=glyphish_user|edge_bc|FFBB00|000000|You+Are+Here',
            scaledSize: new google.maps.Size(83, 30)
          }
        };
        return location;
      },
      getInputLocation: function(lat, long) {
        var location = {
          id: 0,
          coords: {
            latitude: lat,
            longitude: long
          },
          icon: {
            url: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=glyphish_user|edge_bc|FFBB00|000000|You+Are+Here',
            scaledSize: new google.maps.Size(83, 30)
          }
        };
        return location;
      },
      getMapCenter: function() {
        var currentLocation = CordovaGeolocation.get();
        var center = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        };
        return center;
      }
    }
  }
])
