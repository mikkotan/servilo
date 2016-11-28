app.factory("Role", ["Database",function(Database){
  return
    isAdmin : function(id){
      var admin = Database.roleRef.child('admin').child(id);
    },
    restaurantOwner : function(id){
      var admin = Database.roleRef.child('admin').child(id);
    },
    user : function(id){
      var admin = Database.roleRef.child('admin').child(id);
    },

}])
