app.factory("CordovaGeolocation", ["$cordovaGeolocation",
function($cordovaGeolocation){

  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  var location = {
    latitude: null, 
    longitude: null
  };

  return  {
    get : function() {
      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      });
      return location;
    }
  }
}]);
