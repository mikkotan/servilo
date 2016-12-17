app.factory("Role", ["User" ,"$q", function(User ,$q){

  let role = {}

  return {
    get : function(id){



      var admin = User.isAdmin(id).then((val) => { role.isAdmin = val})
      var user =     User.isUser(id).then((val) => { role.isUser = val})
      var restaurant_owner = User.isRestaurantOwner(id).then((val) => {
        role.isRestaurantOwner = val
        role.isAny = false
        role.isAnyExceptUser = false
        if(role.isAdmin || role.isUser || role.isRestaurantOwner){
          role.isAny = true
        }
        if(role.isAdmin || role.isRestaurantOwner){
          role.isAnyExceptUser = true
        }
      })

      $q.all([user,restaurant_owner,admin])

      return role
    }
  }
}])
