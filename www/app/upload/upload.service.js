app.factory("Upload", ["Database", "$firebaseArray",
  function(Database, $firebaseArray){

  var storageRef = firebase.storage().ref();
  var options = {
    maximumImagesCount: 10,
    width: 400,
    quality: 20
  }

  var metadata = {
    contentType: 'image/jpeg'
  };

  return  {
    get : function(base64){
      var d = new Date();
      var child = 'reviews/' + d.getTime() + '.jpg';
      var reviewsRef = storageRef.child(child).putString(base64, 'data_url', metadata);
      return reviewsRef;
    },
    multipleUpload : function(reviewId) {
       var ref = Database.reviewsReference().child(reviewId).child('images');
       return $firebaseArray(ref);
    }
  }
}]);
