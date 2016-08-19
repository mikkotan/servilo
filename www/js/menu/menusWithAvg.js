app.factory("MenusWithAvg", function($firebaseArray) {
  return $firebaseArray.$extend({
    avg: function() {
      var total = 0;
      var count = 0;
      var avg = 0;
      angular.forEach(this.$list, function(rec) {
        total += rec.price;
        count ++;
      });
      return total / count;
    }
  });
})
