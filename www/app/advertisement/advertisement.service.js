app.factory('Advertisement', function(Database, $firebaseArray, $firebaseObject) {

  var Advertisement = {

    get : function(restaurantId) {

      return $firebaseObject(Database.advertisementsReference().child(restaurantId))
    },
    create : function(advertisement, restaurantId){

      var ref = Database.advertisementsReference().child(restaurantId)
      return ref.set(advertisement)
        .then(() => {
          return this.isAdvertised(restaurantId)
        })
    },
    getRestaurants : function() {

      var query = Database.advertisementsReference().orderByChild('endDate').startAt(Date.now())
      return $firebaseArray(query);
    },
    isAdvertised : function(restaurantId) {
      
      return Database.advertisementsReference().child(restaurantId).once('value')
        .then((snapshot) => {
          return {
            exists : snapshot.exists(),
            details : snapshot.val(),
            isValid : snapshot.val().endDate > new Date()
          }
        })
    }
  }

  return Advertisement
})
