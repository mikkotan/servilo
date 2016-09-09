var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount  : "./service-account.json",
  databaseURL : "https://jepsrestaurantdev.firebaseio.com"
})

var db = firebase.database();
var ref = db.ref().child('restaurants');
var reviewRef = db.ref().child('reviews');
var serverRef = db.ref().child('server');
var count = 0;

var changed1 = 0;
// ref.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot, prevKey) {
//   var data = snapshot.val();
//   var newCallback = trialCallbackRef.push();
//
//   newCallback.set({
//     name : data.name,
//     location : data.location,
//     owner_id : data.owner_id
//   })
// })

// ref.on('child_changed', function(snapshot) {
//   var snap = snapshot.val();
//   console.log(snap);
//   var withReviews = (snapv.reviews != null);
//   console.log("withReviews: "+withReviews);
// })
//
// trialCallbackRef.on('child_changed', function(snapshot) {
//   console.log("IT HAS CHANGED");
//   var loco = snapshot.val();
//   console.log(loco);
// })
//
// trialCallbackRef.on('child_removed', function(snapshot) {
//   var snaps = snapshot.val();
//   console.log("this id has been removed "+snaps.name);
// })

reviewRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot, prevKey) {
  var review = snapshot.val();
  var resRef = db.ref().child('restaurants').child(review.restaurant_id);
  var sumRatingRef = resRef.child('sumRating');
  var totalRatingCountRef = resRef.child('totalRatingCount');
  var avgRatingRef = resRef.child('avgRate');
  var sum;
  var count;

  sumRatingRef.once('value', function(currentSum) {
    sumRatingRef.transaction(function(currentSum) {
        if(!currentSum) {
          console.log('null');
          return review.rating;
        }
        console.log('nut null');
        sum = currentSum + review.rating;
        return sum;
    })
  })

  totalRatingCountRef.once('value', function(currentCount) {
    totalRatingCountRef.transaction(function(currentCount) {
      if(!currentCount) {
        return 1;
      }
      count = currentCount +1
      return count;
    })
  })

  avgRatingRef.once('value', function(currentAvg) {
    avgRatingRef.transaction(function(currentAvg) {
      if(!currentAvg) {
        return review.rating / 1;
      }
      var avg = sum / count;
      return avg;
    })
  })

})

reviewRef.on('child_changed', function(snapshot) {
  var review = snapshot.val();
  var resRef = db.ref().child('restaurants').child(review.restaurant_id);
  var prevRating = db.ref().child('reviews').child(snapshot.key).child('prevRating');
  var sumRatingRef = resRef.child('sumRating');
  var totalRatingCountRef = resRef.child('totalRatingCount');
  var avgRatingRef = resRef.child('avgRate');
  var sum;
  var count;

  sumRatingRef.once('value', function(snap) {
    sumRatingRef.transaction(function(currentSum) {
      if(!currentSum) {
        return 1;
      }
      console.log(currentSum);
      sum = currentSum - review.prevRating + review.rating;
      return sum;
    })
  })

  totalRatingCountRef.once('value', function(snap) {
    totalRatingCountRef.transaction(function(currentCount) {
      if(!currentCount) {
        return 1;
      }
      count = currentCount;
      return count;
    })
  })

  avgRatingRef.once('value', function(snap) {
    avgRatingRef.transaction(function(currentAvg) {
      if(!currentAvg) {
        return 1;
      }
      var avg = sum / count;
      return avg;
    })
  })

  prevRating.once('value', function(snap) {
    prevRating.transaction(function(currentPrevRating) {
        return review.rating;
    })
  })

})

reviewRef.on('child_removed', function(snapshot) {
  var review = snapshot.val();
  var resRef = db.ref().child('restaurants').child(review.restaurant_id);
  var prevRating = db.ref().child('reviews').child(snapshot.key).child('prevRating');
  var sumRatingRef = resRef.child('sumRating');
  var totalRatingCountRef = resRef.child('totalRatingCount');
  var avgRatingRef = resRef.child('avgRate');
  var sum;
  var count;

  sumRatingRef.once('value', function(snap) {
    sumRatingRef.transaction(function(currentSum) {
      if(!currentSum) {
        return 1;
      }
      console.log(currentSum);
      sum = currentSum - review.rating;
      return sum;
    })
  })

  totalRatingCountRef.once('value', function(snap) {
    totalRatingCountRef.transaction(function(currentCount) {
      if(!currentCount) {
        return 1;
      }
      count = currentCount - 1;
      return count;
    })
  })

  avgRatingRef.once('value', function(snap) {
    avgRatingRef.transaction(function(currentAvg) {
      if(!currentAvg) {
        return 1;
      }
      if(count === 0) {
        return 0
      }
      else {
        var avg = sum / count;
        return avg;
      }
    })
  })

})
