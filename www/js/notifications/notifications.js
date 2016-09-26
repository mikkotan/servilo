app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "User",
  function($scope, $firebaseArray, User, notifications){
    // $scope.notifications = notifications.map(function(notification) {
    //   return {
    //     notification : notification,
    //     sender : User.getUserFullname(notification.sender_id)
    //   }
    // })
    // $scope.notifications = notifications;
    $scope.notifications = User.getAuthNotifications();

    // $scope.notifications = notifications;
    // $scope.notifications = $firebaseArray(r.notificationsReference().orderByChild('receiver_id').equalTo(User.auth().$id));
    // $scope.hello = "neoti";
  }]);
