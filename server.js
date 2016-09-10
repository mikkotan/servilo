var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount  : "./service-account.json",
  databaseURL : "https://jepsrestaurantdev.firebaseio.com"
})

var db = firebase.database();
console.log("Thesis Server Running...");


var calculateReviews = function(reviewSnap, typeKind) {
  var review = reviewSnap.val();
  var review_id = reviewSnap.key;
  var resRef = db.ref().child('restaurants').child(review.restaurant_id);
  var prevRatingRef = db.ref().child('reviews').child(reviewSnap.key).child('prevRating');
  var sumRatingRef = resRef.child('sumRating');
  var totalRatingCountRef = resRef.child('totalRatingCount');
  var avgRatingRef = resRef.child('avgRate');
  var sum;
  var count;

  sumRatingRef.transaction(function(currentSum) {
    if(!currentSum) {
      return review.rating;
    }
    if(typeKind == 'add') {
      sum = currentSum + review.rating;
    }
    else if(typeKind == 'update') {
      sum = currentSum - review.prevRating + review.rating;
    }
    else if(typeKind == 'delete') {
      sum = currentSum - review.rating;
    }
    return sum;
  })

  totalRatingCountRef.transaction(function(currentCount) {
    if(!currentCount) {
      return 1;
    }

    if(typeKind == 'add') {
      count = currentCount + 1;
    }
    else if(typeKind == 'update') {
      count = currentCount;
    }
    else if(typeKind == 'delete') {
      count = currentCount - 1;
    }
    return count;
  })

  avgRatingRef.transaction(function(currentAvg) {
    if(!currentAvg) {
      return review.rating / 1;
    }
    if(count <= 0 ) {
      return 0;
    }
    else {
      var avg = sum / count;
      return avg;
    }
  })

  if(typeKind !== 'delete') {
    prevRatingRef.transaction(function(currentPrevRating) {
      return review.rating;
    })
  }

}

reviewRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot, prevKey) {
  console.log('child added running');
  var review = snapshot;
  calculateReviews(review, 'add');
})

reviewRef.on('child_changed', function(snapshot) {
  console.log('child changed added');
  var review = snapshot;
  calculateReviews(review, 'update');
})

reviewRef.on('child_removed', function(snapshot) {
  console.log('child removed added');
  var review = snapshot;
  calculateReviews(review, 'delete');
})
