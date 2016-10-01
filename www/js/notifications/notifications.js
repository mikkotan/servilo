app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "User", "Restaurant", "notifications",
  function($scope, $firebaseArray, User, Restaurant, notifications){

    $scope.notifs = notifications;
    // $scope.notifs.sender = User.getUserFullname;
    // $scope.notifs.restaurant = Restaurant.get;

    $scope.$watchCollection('notifs', function(newNotifs) {
      $scope.newNotifs = newNotifs.map(function(notification) {
        return {
          sender : User.getUserFullname(notification.sender_id),
          restaurant : Restaurant.get(notification.restaurant_id).name
        }
      })
    });

    // $scope.notifications = $scope.notifs.map(function(notification) {
    //   return {
    //     notification : notification,
    //     sender : User.getUser
    //   }
    // })

    // $scope.$watch('notifs', function() {
    //   $scope.notifs = notifications.map(function(notification) {
    //     return {
    //       notification : notification,
    //       sender : User.getUserFullname(notification.sender_id),
    //       restaurant : Restaurant.get(notification.restaurant_id).name
    //     }
    //   })
    // })

    // $scope.notifs = notifications.map(function(notification) {
    //   return {
    //     notification : notification,
    //     sender : User.getUserFullname(notification.sender_id),
    //     restaurant : Restaurant.get(notification.restaurant_id).name,
    //   }
    // });

  }]);
