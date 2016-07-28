app.factory("Menu",["$firebaseAuth","$firebaseArray","$firebaseObject",
  function($firebaseAuth , $firebaseArray , $firebaseObject){

    var menus = firebase.database().ref().child("menus")
    return {
      all : function() {
        return $firebaseArray(menus);
      }
    }

}]);
