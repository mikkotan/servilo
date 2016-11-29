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

  var getChild = function(ref) {
    var child = ref + '/' + new Date().getTime() + '.jpg';
    return child;
  }

  return  {
    get : function(base64){
      var d = new Date();
      var child = 'reviews/' + d.getTime() + '.jpg';
      var reviewsRef = storageRef.child(child).putString(base64, 'data_url', metadata);
      return reviewsRef;
    },
    multipleUpload : function(id) {
      var ref = Database.reviewsReference().child(id).child('images');
      return $firebaseArray(ref);
    },
    getSource : function(input) {
      var source = "";
      switch(input) {
        case 1:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 2:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      return source;
    },
    getOptions : function(source) {
      return options = {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : source,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      }
    },
    getProgress : function(snapshot) {
      return (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    restaurant : function(base64) {
      return storageRef.child(getChild('restaurant')).putString(base64, 'base64', metadata);
    },
    profile : function(base64) {
      return storageRef.child(getChild('profile')).putString(base64, 'base64', metadata);
    },
    menu : function(base64) {
      return storageRef.child(getChild('menu')).putString(base64, 'base64', metadata);
    },
  }
}]);
