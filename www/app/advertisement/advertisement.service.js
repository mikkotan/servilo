app.factory('Advertisement', function(Database, $firebaseArray, $firebaseObject) {
  var Advertisement = {
    get : function(restaurantId) {
      return $firebaseObject(Database.advertisementsReference().child(restaurantId))
    },
    create : function(advertisement, restaurantId){
      return Database.advertisementsReference().child(restaurantId).set(advertisement)
    },
    getRestaurants : function() {
      var query = Database.advertisementsReference().orderByChild('endDate').startAt(Date.now())
      return $firebaseArray(query);
    },
    isAdvertised : function(restaurantId) {
      return Database.advertisementsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          return snapshot.exists()
        })
    }
  }

  return Advertisement
})
