app.factory("Role", ["User" , function(User){

  let role = {}

  return {
    get : function(id){
      User.isAdmin(id).then((val) => {
        role.isAdmin = val
        User.isUser(id).then((val) => {
          role.isUser = val
          User.isRestaurantOwner(id).then((val) => {
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

        })

      })
        return role
    }
  }
}])
