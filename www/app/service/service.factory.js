app.factory("Service", ["$firebaseObject", "$firebaseArray", "$firebaseAuth","Database",
  function($firebaseObject, $firebaseArray, $firebaseAuth, Database){


    var serviceRef = Database.serviceReference();
    var services = Database.services();

    var Service = {
      all : function() {
        return services;
      },
      onlineService : function(restaurant_id){
        return serviceRef.child('online').child(id)
      },
      reservationService : function(){
        return serviceRef.child('reserve').child(id)
      },
      cateringService : function(){
        return serviceRef.child('cater').child(id)
      }
    }
    return Service;
  }])
