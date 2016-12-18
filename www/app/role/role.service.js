app.factory("Role", ["User" ,"$q", function(User ,$q){

  let role = {}

  return {
    get : function(id){

      role.isAny = false
      role.isAnyExceptUser = false

      return $q.all([User.isUser(id),User.isRestaurantOwner(id),User.isAdmin(id)]).then((value)=>{
        role.isUser = value[0];
        role.isRestaurantOwner = value[1];
        role.isAdmin = value[2]
        if(role.isAdmin || role.isUser || role.isRestaurantOwner){
          role.isAny = true
        }
        if(role.isAdmin || role.isRestaurantOwner){
          role.isAnyExceptUser = true
        }
        return role
      })


    }
  }
}])
