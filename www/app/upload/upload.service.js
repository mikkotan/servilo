app.factory("Upload", ["Database", "$firebaseArray", "$q",
  function(Database, $firebaseArray, $q){

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
    review : function(result){
      var deferred = $q.defer();
      window.plugins.Base64.encodeFile(result, function(base64) {
        var reviewsRef = storageRef.child(getChild('reviews')).putString(base64, 'data_url', metadata);
        reviewsRef.on('state_changed', function(snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, function(error) {
          console.log("error in uploading." + error);
        }, function() {
          var downloadURL = reviewsRef.snapshot.downloadURL;
          // deferred.resolve(downloadURL);
          ///thumb
          var base64Cut = base64.substring(34);
          window.imageResizer.resizeImage(
            function(data) {
              var thumbnailRef = storageRef.child(getChild('reviews-thumb')).putString(data.imageData, 'base64', metadata);
              thumbnailRef.on('state_changed', function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Thumb Upload is ' + progress + '% done');
              }, function(error) {
                console.log("error in thumb uploading." + error);
              }, function() {
                var thumbURL = thumbnailRef.snapshot.downloadURL;
                deferred.resolve({original: downloadURL, thumb: thumbURL});
              });
            }, function (error) {
              console.log("Error : \r\n" + error);
            }, base64Cut,
            150,
            150,
            {
              resizeType: ImageResizer.RESIZE_TYPE_PIXEL,
              imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
              format: ImageResizer.FORMAT_JPG
            }
          );
          ///thumb
        });
      });
      return deferred.promise;
    },
    getMultipleUpload : function(restaurantId, reviewId) {
      var ref = Database.restaurantReviewsReference().child(restaurantId).child(reviewId).child('images');
      return $firebaseArray(ref);
    },
    uploadMultiple : function(images, restaurantId, reviewId) {
      var list = this.getMultipleUpload(restaurantId, reviewId);
      for (var i = 0; i < images.length; i++) {
        list.$add({
          src: images[i].original,
          thumb: images[i].thumb
        })
        .then(function(ref) {
          console.log("added..." + ref);
        });
      }
    },
    getOptions : function(input) {
      var source = "";
      switch(input) {
        case 1:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 2:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      return options = {
        quality : 50,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : source,
        // allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 700,
        targetHeight: 700,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: false
      }
    },
    getMultipleUploadOptions : function() {
      var options = {
        maximumImagesCount: 10,
        width: 400,
        quality: 20
      }
      return options;
    },
    getProgress : function(snapshot) {
      return (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    restaurant : function(base64) {
      var deferred = $q.defer();
      var restaurantRef = storageRef.child(getChild('restaurant')).putString(base64, 'base64', metadata);
      restaurantRef.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.log("error in uploading." + error);
        deferred.resolve(error);
      }, function() {
        deferred.resolve(restaurantRef.snapshot.downloadURL);
      });
      return deferred.promise;
    },
    profile : function(base64) {
      var deferred = $q.defer();
      var profileRef = storageRef.child(getChild('profile')).putString(base64, 'base64', metadata);
      profileRef.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.log("error in uploading." + error);
        deferred.resolve(error);
      }, function() {
        deferred.resolve(profileRef.snapshot.downloadURL);
      });
      return deferred.promise;
    },
    menu : function(base64) {
      var deferred = $q.defer();
      var menuRef = storageRef.child(getChild('menu')).putString(base64, 'base64', metadata);
      menuRef.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.log("error in uploading." + error);
        deferred.resolve(error);
      }, function() {
        deferred.resolve(menuRef.snapshot.downloadURL);
      });
      return deferred.promise;
    },
    promo : function(base64) {
      var deferred = $q.defer();
      var promoRef = storageRef.child(getChild('promo')).putString(base64, 'base64', metadata);
      promoRef.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.log("error in uploading." + error);
        deferred.resolve(error);
      }, function() {
        deferred.resolve(promoRef.snapshot.downloadURL);
      });
      return deferred.promise;
    }
  }
}]);
