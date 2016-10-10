app.factory("RestaurantFactory",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  return {
    getValue : $firebaseObject.$extend({
      average: function(){
        var avg = this.sumPrice / this.totalMenuCount;
        return avg.toFixed(2);
      }
    })
  }
}])
