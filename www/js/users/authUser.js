app.factory("AuthUser", ["$firebaseObject", "$firebaseArray", "$firebaseAuth",
  function($firebaseObject, $firebaseArray, $firebaseAuth){
    var ref = firebase.database().ref().child('users').child(firebase.auth().currentUser.uid);
    return $firebaseObject(ref);
  }])
