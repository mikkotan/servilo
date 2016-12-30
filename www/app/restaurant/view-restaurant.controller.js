app.controller("ViewRestaurantCtrl", ["$scope", "$state", "Upload", "$stateParams", "ionicMaterialInk", "$ionicLoading", "$ionicModal", "$ionicPopup", "CordovaGeolocation", "Restaurant", "User", "Review", "Reservation", "$ionicLoading", "Notification", "$ionicSlideBoxDelegate", "$ionicScrollDelegate", "Gallery", "$timeout",
  function($scope, $state, Upload, $stateParams, ionicMaterialInk, $ionicLoading, $ionicModal, $ionicPopup, CordovaGeolocation, Restaurant, User, Review, Reservation, $ionicLoading, Notification, $ionicSlideBoxDelegate, $ionicScrollDelegate, Gallery, $timeout) {

    $ionicLoading.show();
    // ionicMaterialInk.displayEffect();
    $scope.$on('applyInk', function(e) {
      ionicMaterialInk.displayEffect();
    })
    $scope.$emit('applyInk');

    console.log("View Restaurant Ctrl")

    $scope.rating = {
      rate: 0,
      max: 5
    }
    $scope.user = User.auth();


    $scope.goToOrder = function() {
      $state.go('tabs.viewRestaurant.menus');
    }

    var restaurantId = $stateParams.restaurantId;
    var userReviewsRef = Review.userReview(restaurantId);
    $scope.loadingReviews = false;

    Restaurant.getAverageRating(restaurantId)
      .then((res) => {
        $scope.avg = res
      });


    Restaurant.get(restaurantId).$loaded()
      .then(function(restaurant) {
        $scope.image = {};
        $scope.restaurant = restaurant;
        User.hasFavored(restaurant.$id)
          .then((val) => {
            console.log('Hasfavored from controller : '+val.exists)
            $scope.hasFavored = val.exists
            $scope.restaurantOpenStatus = Restaurant.getRestaurantOpenStatus(restaurant);
            var restaurantStatus = Restaurant.getRestaurantStatus(restaurant.owner_id)
            restaurantStatus.on('value', function(snap) {
              $scope.getRestaurantStatus = snap.val() ? true : false;
              $ionicLoading.hide();
            })
          })
          .catch((err) => {
            console.log('Has favored error');
            console.log(err);
          })

        Restaurant.getReviews(restaurant.$id).$loaded().then(function(reviews) {
          $scope.restaurantReviews = reviews;
          $scope.loadingReviews = true;
          console.log('done loading reviews')
          $ionicLoading.hide();
        });
      })

    $scope.isAlreadyReviewed = function() {
      userReviewsRef.once('value', function(snapshot) {
        $scope.exists = snapshot.val();
        if ($scope.exists !== null) {
          $scope.review = Review.get(restaurantId, snapshot.val());
        }
      })
    }
    $scope.isAlreadyReviewed();

    $scope.getImages = function(images) {
      var items = [];
      for (var key in images) {
        items.push(images[key]);
      }
      return items;
    }

    $scope.bookReservation = function(reservation) {
      var confirmReservation = $ionicPopup.confirm({
        title: 'Confirm',
        template: 'Confirm your reservation?',
        cssClass: 'custom-popup',
        scope: $scope
      });
      confirmReservation.then(function(res) {
        if (res) {
          Reservation.create({
              datetime: reservation.datetime.getTime(),
              number_of_persons: reservation.number_of_persons,
              status: 'pending',
              user_id: User.auth().$id,
              note: reservation.note,
              restaurant_id: restaurantId,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
            .then(() => {
              console.log('success reservation')
              alert('Reservation has been booked successfully.');
            })
            .catch((err) => {
              console.log(err);
              alert(err);
            })
          $scope.addReservationModal.hide();
        }
      });
    }

    $scope.getName = function(userId) {
      return Review.reviewer(userId);
    }

    $scope.addToFavorites = function(restaurant) {
      $ionicPopup.confirm({
        title: 'Add to Favorites',
        template: "Add '" + restaurant.name + "' to favorites?"
      })
        .then((res) => {
          User.addToFavorites(restaurant)
            .then((val) => {
              $scope.hasFavored = val.exists
              $scope.$apply()
            })
        })
    }

    $scope.showAddReservationModal = function() {
      $scope.reservation = {
        datetime: new Date(),
        number_of_persons: 2,
      }
      $scope.addReservationModal.show();
    }

    $scope.images = [];
    $scope.isUploadDone = true;
    $scope.selImages = function() {
      window.imagePicker.getPictures(function(results) {
        (results.length > 0) ? ($scope.isUploadDone = false) : ($scope.isUploadDone = true);
        $scope.$apply();
        var count = 0;
        for (var i = 0; i < results.length; i++) {
          Upload.review(results[i]).then(function(downloadURL) {
            $scope.images.push(downloadURL);
            count++;
            $scope.isUploadDone = (count == results.length) ? true : false;
          })
        }
      }, function(error) {
          $scope.isUploadDone = true;
          console.log('Error: ' + JSON.stringify(error));
      }, Upload.getMultipleUploadOptions());
    }

    var clearReview = function(review) {
      review.content = '';
      review.rating = 0;
      $scope.images = [];
    }

    $scope.openReviewModal = function() {
      $scope.reviewModal.show();
      $scope.$emit('applyInk');
    }

    $scope.addReview = function(review) {
      $ionicLoading.show();
      try {
        var newReview = Review.addReview(restaurantId, review);
        newReview.ref
          .then(function() {
            $ionicLoading.hide();
            Upload.uploadMultiple($scope.images, restaurantId, newReview.key);
            Upload.uploadMultipleRestaurant($scope.images, restaurantId);
            console.log("add review done");
            $scope.isAlreadyReviewed();
            $scope.reviewModal.hide();
            clearReview(review);
            $ionicLoading.hide();
            Review.userReview(restaurantId).set(newReview.key).then(function() {
              console.log('added to user_reviews')
            });
            Notification.create({
              sender_id: User.auth().$id,
              receiver_id: $scope.restaurant.owner_id,
              restaurant_id: restaurantId,
              type: 'review',
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
          })
          .catch(function(err) {
            alert(err);
            // $ionicLoading.hide();
          })
      } catch (e) {
        $ionicLoading.hide();
        $scope.submitError = true;
      }
    }

    $scope.openEditModal = function(review) {
      $scope.editReviewModal.show();
      $scope.$emit('applyInk');
      $scope.editImages = Upload.getMultipleUpload(restaurantId, review.$id);
    }

    $scope.updateReview = function(review) {
      Review.editReview(restaurantId, review)
        .then(function() {
          console.log("finished updating review.");
          Upload.uploadMultiple($scope.images, restaurantId, review.$id);
          $scope.images = [];
          $scope.editReviewModal.hide();
        })
      $scope.isAlreadyReviewed();
    };

    $ionicModal.fromTemplateUrl('app/review/_new-review.html', function(reviewModal) {
      $scope.reviewModal = reviewModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/review/_edit-review.html', function(editReviewModal) {
      $scope.editReviewModal = editReviewModal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/review/_edit-review.html', function(editModalReview) {
      $scope.editReviewModal = editModalReview;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('app/reservation/_add-reservation.html', function(addReservationModal) {
      $scope.addReservationModal = addReservationModal;
    }, {
      scope: $scope
    })

    $ionicModal.fromTemplateUrl('app/review/_new-reply.html', function(addReplyModal) {
      $scope.addReplyModal = addReplyModal;
    }, {
      scope: $scope
    })

    $ionicModal.fromTemplateUrl('app/review/_view-review.html', function(viewReviewModal) {
      $scope.viewReviewModal = viewReviewModal;
    }, {
      scope: $scope
    })

    $scope.getReplies = function(reviewId) {
      return Review.getReplies(restaurantId, reviewId);
    }

    $scope.openReplyModal = function(review) {
      Restaurant.openReplyModal($scope, review);
    }

    $scope.openEditReplyModal = function(reply, reviewId) {
      Restaurant.openEditReplyModal($scope, reply, reviewId, restaurantId);
    }

    $scope.addReply = function(reply) {
      Review.addReply(restaurantId, reply, $scope.reviewId)
        .then(function() {
          reply.content = "";
          $scope.addReplyModal.hide();
        })
    }

    $scope.editReply = function(reply) {
      Review.editReply(reply)
        .then(function() {
          $scope.editReplyModal.hide();
        })
    }

    $scope.showConfirmDelete = function(review) {
      var confirmDelete = $ionicPopup.confirm({
        title: "Delete Review",
        template: "Delete '" + review.content + "'?"
      })

      confirmDelete.then(function(res) {
        var reviewsDeleteRef = Review.getReview(restaurantId, review.$id);
        if (res) {
          reviewsDeleteRef.remove();
          userReviewsRef.remove();
          $scope.isAlreadyReviewed();
        } else {
          console.log("delete failed");
        }
      })
    }

    $scope.showGallery = function(allImages) {
      console.log('cleck')
      Gallery.set(allImages);
    }

    $scope.deleteImage = function(images, image) {
      var confirmDelete = $ionicPopup.confirm({
        title: "Delete Photo",
        template: "Are you sure you want to delete this photo?"
      })

      confirmDelete.then(function(res) {
        if (res) {
          images.$remove(image);
          console.log("image removed")
        } else {
          console.log("delete failed");
        }
      })
    }

    $scope.showReviewModal = function(review, reviewer) {
      $scope.showGallery(review.images);
      $scope.viewReviewModal.show();
      $scope.viewReview = review;
      $scope.viewReviewer = reviewer;
      $scope.viewItems = Gallery.get();
    }

    $scope.callNumber = function(number) {
      window.plugins.CallNumber.callNumber(function() {
        console.log("call success");
      }, function() {
        console.log("call failed");
      }, number)
    };

    $scope.days = {
      '0': {
        name: 'Monday'
      },
      '1': {
        name: 'Tuesday'
      },
      '2': {
        name: 'Wednesday'
      },
      '3': {
        name: 'Thursday'
      },
      '4': {
        name: 'Friday'
      },
      '5': {
        name: 'Saturday'
      },
      '6': {
        name: 'Sunday'
      }
    }

  }
]);
