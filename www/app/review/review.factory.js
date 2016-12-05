app.factory("Review", ["$firebaseObject", "$firebaseArray", "$firebaseAuth", "Database","User", "$q",
  function($firebaseObject, $firebaseArray, $firebaseAuth, Database, User, $q){


    var rootRef = Database.rootReference();
    var reviews = Database.reviewsReference();
    var restaurants = Database.restaurantsReference();
    var users = Database.usersReference();
    var userReviews = Database.userReviewsReference();
    var restaurantReviews = Database.restaurantReviewsReference();
    // var reviewsArray = Database.reviews();
    // var restaurantsArray = Database.restaurants();
    // var usersArray = Database.users();

    var Review = {
      all : function() {
        return reviewsArray;
      },
      get : function(restaurantId, reviewId) {
        return $firebaseObject(restaurantReviews.child(restaurantId).child(reviewId));
      },
      getReview : function(restaurantId, reviewId) {
        return restaurantReviews.child(restaurantId).child(reviewId);
      },
      // restaurant : function(review) {
      //   return Database.restaurants().$getRecord(review.restaurant_id);
      // },
      reviewer : function(id) {
        // return usersArray.$getRecord(review.reviewer_id);
        return $firebaseObject(users.child(id));
      },
      // reference : function() {
      //   return reviews;
      // },
      userReview : function(restaurantId){
        var authUserId = User.auth().$id;
        return userReviews.child(authUserId).child(restaurantId);
        // return users.child(authUserId).child('reviewed_restaurants').child(id);
      },
      restaurantReview : function(id){
        return reviews.orderByChild('restaurant_id').equalTo(id)
      },
      addReview : function(restaurantId, review) {
        var key = restaurantReviews.child(restaurantId).push().key;
        // var key = reviews.push().key;
        console.log("key: " + key)
        var reviewRef = restaurantReviews.child(restaurantId).child(key);
        var reviewObj = {
          content: review.content,
          rating: review.rating,
          prevRating: review.rating,
          restaurant_id: restaurantId,
          reviewer_id: User.auth().$id,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        return {
          ref: reviewRef.set(reviewObj),
          key: key
        }
      },
      editReview : function(restaurantId, review) {
        var reviewRef = this.getReview(restaurantId, review.$id);
        return reviewRef.update({
          content: review.content,
          rating: review.rating
        })
      },
      addReply : function(restaurantId, reply, reviewId) {
        var replyRef = restaurantReviews.child(restaurantId).child(reviewId).child('replies').push();
        return replyRef.set({
          content: reply.content,
          prevContent: "",
          user_id: User.auth().$id
        })
      },
      editReply : function(reply) {
        var replyRef = restaurantReviews.child(reply.restaurantId).child(reply.reviewId).child('replies').child(reply.$id);
        return replyRef.update({
          prevContent: reply.oldContent,
          content: reply.content,
          user_id: User.auth().$id
        })
      },
      getReplies : function(restaurantId, reviewId) {
        return $firebaseArray(restaurantReviews.child(restaurantId).child(reviewId).child('replies'))
      },
      getLastKey : function(reviewArray) {
        return reviewArray[reviewArray.length-1].$id;
      },
      nextReviews : function(key, restaurantId) {
        // var query = restaurantsRef.orderByKey().startAt(key+1).limitToFirst(5);
        var query = restaurantReviews.child(restaurantId).orderByKey().startAt(key+1).limitToFirst(5);
        return $firebaseArray(query);
      }
    }

    return Review;
  }])
