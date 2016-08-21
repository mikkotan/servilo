app.factory("UserFactory",["$firebaseObject" , "$firebaseAuth","$firebaseArray",
  function($firebaseObject ,$firebaseAuth, $firebaseArray){
  return {
    object : $firebaseObject.$extend({
      getFullName: function(){
        return this.firstName + " " + this.lastName;
      }
    }),
    array : $firebaseArray.$extend({
      getFullName : function(){
        return this.firstName + " " + this.lastName;
      }
    })
  }
}])
