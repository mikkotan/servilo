app.factory("Review", ["$firebaseObject", "$firebaseArray", "$firebaseAuth", "Database",
  function($firebaseObject, $firebaseArray, $firebaseAuth, Database){
    var rootRef = Database.rootReference();
    var reviews = Database.reviewsReference();
    var restaurants = Database.restaurantsReference();
    var users = Database.usersReference();
    
    var reviewsArray = Database.reviews();
    var restaurantsArray = Database.restaurants();
    var usersArray = Database.users();

    var Review = {
      all : function() {
        return reviewsArray;
      },
      restaurant : function(review) {
        return Database.restaurants().$getRecord(review.restaurant_id);
      },
      reviewer : function(review) {
        return usersArray.$getRecord(review.reviewer_id);
      },
      reference : function() {
        return reviews;
      }
    }

    return Review;
  }])
