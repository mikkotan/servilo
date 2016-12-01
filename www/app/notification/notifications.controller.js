app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "User", "Restaurant", "notifications", "Notification",
  function($scope, $firebaseArray, User, Restaurant, notifications, Notification){

    $scope.notifs = notifications;

    $scope.markReadAll = function() {
      return Notification.markReadAll(notifications);
    }

    $scope.markRead = function(notif) {
      return Notification.markRead(notif);
    }

    $scope.$watchCollection('notifs', function(newNotifs) {
      $scope.newNotifs = newNotifs.map(function(notification) {
        var n =  {
          self : notification,
          id : notification.$id,
          sender_id : notification.sender_id,
          status : notification.status,
          order_no : notification.order_no,
          getSender : function() {
            User.getUser(notification.sender_id).$loaded()
              .then((user) => {
                n.sender = user.firstName + " " +user.lastName
              })
          }(),
          restaurant : function() {
            Restaurant.getRestaurantName(notification.restaurant_id)
              .then((name) => {
                n.restaurant_name = name;
              })
          }(),
          timestamp : notification.timestamp,
          type : notification.type,
        }

        return n;
      })
    });

  }]);
