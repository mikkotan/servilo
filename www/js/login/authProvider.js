app.factory("AppUser", ["Auth" , function(Auth){
  return function() {
    Auth.$onAuthStateChanged(function(firebaseUser){
    this.currentUser  = firebaseUser
    });
  }
}]);
