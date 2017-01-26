//app.factory('Category', function(Database, $firebaseArray) {
//  var Category = {
//    getAllCategories : function() {
//      return $firebaseArray(Database.categoryRestaurantsReference())
//    },
//    getRestaurants : function(category) {
//      return $firebaseArray(Database.categoryRestaurantsReference().child(category).child('restaurants'))
//    }
//  }
//  return Category
//})

app.factory('Category', ['Database', '$firebaseArray', 
  function(Database, $firebaseArray) {
    var Category = {
      getAllCategories : function() {
        return $firebaseArray(Database.categoryRestaurantsReference())
      },
      getRestaurants : function(category) {
        return $firebaseArray(Database.categoryRestaurantsReference().child(category).child('restaurants'))
      }
    }
    return Category
  }  
])
