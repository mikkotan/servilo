var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount  : "./service-account.json",
  databaseURL : "https://jepsrestaurantdev.firebaseio.com"
})

var db = firebase.database();
var ref = db.ref().child('restaurants');

var trialCallbackRef = db.ref().child('callbackTrial');
var count = 0;


ref.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot, prevKey) {
  var data = snapshot.val();
  var newCallback = trialCallbackRef.push();

  newCallback.set({
    name : data.name,
    location : data.location,
    owner_id : data.owner_id
  })
})

ref.on('child_changed', function(snapshot) {
  var snap = snapshot.val();
  console.log(snap);
  var withReviews = (snapv.reviews != null);
  console.log("withReviews: "+withReviews);
})

trialCallbackRef.on('child_changed', function(snapshot) {
  console.log("IT HAS CHANGED");
  var loco = snapshot.val();
  console.log(loco);
})

trialCallbackRef.on('child_removed', function(snapshot) {
  var snaps = snapshot.val();
  console.log("this id has been removed "+snaps.name);
})
