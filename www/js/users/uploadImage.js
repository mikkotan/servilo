app.controller("Upload",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject",
  function($scope , $firebaseAuth , $firebaseArray , $firebaseObject){
    var file = File("/img/wow.jpg");

    var metadata = {
      contentType: 'image/jpeg'
    };

    var uploadTask = storageRef.child("images/" + file.name).put(file, metadata);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)
        }, function(error){
          console.error("ERROR "+error);
        }
    )
}]);
