app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "User", "Restaurant", "notifications",
  function($scope, $firebaseArray, User, Restaurant, notifications){

    $scope.notifs = notifications;

    $scope.$watchCollection('notifs', function(newNotifs) {
      $scope.newNotifs = newNotifs.map(function(notification) {
        return {
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
