app.factory("Review", ["$firebaseObject", "$firebaseArray", "$firebaseAuth", "Database","User", "$q",
  function($firebaseObject, $firebaseArray, $firebaseAuth, Database, User, $q){


    var rootRef = Database.rootReference();
    var reviews = Database.reviewsReference();
    var restaurants = Database.restaurantsReference();
    var users = Database.usersReference();

    var reviewsArray = Database.reviews();
    // var restaurantsArray = Database.restaurants();
    var usersArray = Database.users();

    var Review = {
      all : function() {
        return reviewsArray;
      },
      get : function(reviewId) {
        return $firebaseObject(reviews.child(reviewId));
      },
      getReview : function(reviewId) {
        return reviews.child(reviewId);
      },
      restaurant : function(review) {
        return Database.restaurants().$getRecord(review.restaurant_id);
      },
      reviewer : function(id) {
        // return usersArray.$getRecord(review.reviewer_id);
        return $firebaseObject(users.child(id));
      },
      reference : function() {
        return reviews;
      },
      userReview : function(id){
        var authUserId = User.auth().$id;
        return users.child(authUserId).child('reviewed_restaurants').child(id);
      },
      restaurantReview : function(id){
        return reviews.orderByChild('restaurant_id').equalTo(id)
      },
      addReply : function(reply, reviewId) {
        var replyRef = reviews.child(reviewId).child('replies').push();
        return replyRef.set({
          content: reply.content,
          prevContent: "",
          user_id: User.auth().$id
        })
      },
      editReply : function(reply) {
        var replyRef = reviews.child(reply.reviewId).child('replies').child(reply.$id);
        return replyRef.update({
          prevContent: reply.oldContent,
          content: reply.content,
          user_id: User.auth().$id
        })
      },
      getReplies : function(reviewId) {
        return $firebaseArray(reviews.child(reviewId).child('replies'))
      },
      getLastKey : function(reviewArray) {
        return reviewArray[reviewArray.length-1].$id;
      },
      nextReviews : function(key, restaurantId) {
        // var query = restaurantsRef.orderByKey().startAt(key+1).limitToFirst(5);
        var query = reviews.orderByChild('restaurant_id').equalTo(restaurantId).startAt(key+1).limitToFirst(5)
        return $firebaseArray(query);
      }
    }

    return Review;
  }])
