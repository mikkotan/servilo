app.factory("Review", ["$firebaseObject", "$firebaseArray", "$firebaseAuth", "Database","User",
  function($firebaseObject, $firebaseArray, $firebaseAuth, Database,User){

    var authUserId = User.auth().$id;
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
      },
      userReview : function(id){
        return users.child(authUserId).child('reviewed_restaurants').child(id);
      },
      restaurantReview : function(id){
        return reviews.orderByChild('restaurant_id').equalTo(id)
      },
    }

    return Review;
  }])
