app.factory("UserFactory",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  return {
    object : $firebaseObject.$extend({
      getFullName: function(){
          this.$loaded().then(function(){
          console.log(this.firstName + " " + this.lastName)
          return this.firstName + " " + this.lastName;
        })

    }
    }),
    array : $firebaseArray.$extend({
      getFullName : function(){
        return this.firstName + " " + this.lastName;
      }
    })
  }
}])
