app.factory('Promo', function(Database) {
  var Promo = {
    create : function(promo) {
      var pushRef = Database.promosReference().child(promo.restaurant_id).push();
      return pushRef.set(promo)
    },
    delete : function(promo) {
      return Database.promosReference().child(promo.restaurant_id).child(promo.$id).set(null);
    }
  }
  return Promo
})
