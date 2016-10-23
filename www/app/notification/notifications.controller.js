app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "User", "Restaurant", "notifications",
  function($scope, $firebaseArray, User, Restaurant, notifications){

    $scope.notifs = notifications;
    console.log($scope.notifs);
    $scope.markReadAll = function() {
      angular.forEach(notifications, function(notif) {
        console.log(notif);
        notifications.$remove(notif)
          .then(() => {
            console.log("success")
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }

    $scope.markRead = function(notif) {
      notifications.$remove(notif)
        .then(() => {
          console.log("success")
        })
        .catch((err) => {
          console.log(err)
        })
    }

    $scope.$watchCollection('notifs', function(newNotifs) {
      $scope.newNotifs = newNotifs.map(function(notification) {
        return {
          self : notification,
          id : notification.$id,
          sender_id : notification.sender_id,
          status : notification.status,
          order_no : notification.order_no,
          sender : User.getUserFullname(notification.sender_id),
          restaurant : Restaurant.get(notification.restaurant_id).name,
          timestamp : notification.timestamp,
          type : notification.type
        }
      })
    });
  }]);
