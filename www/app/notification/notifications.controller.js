app.controller("NotificationsCtrl", ["$scope", "$firebaseArray", "$firebaseObject", "User", "Restaurant", "notifications", "Notification", "Database",
  function($scope, $firebaseArray, $firebaseObject, User, Restaurant, notifications, Notification, Database){

    $scope.notifs = notifications;

    $scope.markRead = function(notif) {
      return Notification.delete(notif)
    }

    $scope.markReadAll = function() {
      return Notification.deleteAll($scope.notifs);
    }

    $scope.$watchCollection('notifs', function(newNotifs) {
      $scope.newNotifs = newNotifs.map(function(notification) {
        var n = {
          getObject : Notification.getOne(notification.$id).$loaded()
            .then((notif) => {
            User.getUser(notif.sender_id).$loaded().then((user) => {
              Restaurant.get(notif.restaurant_id).$loaded()
                .then((restaurant) => {
                  n.restaurant_name = restaurant.name
                  n.sender = user.firstName + " " + user.lastName
                  n.status = notif.status;
                  n.type = notif.type;
                  n.timestamp = notif.timestamp;
                  n.order_no = notif.order_no;
                  n.ready = true
                  n.self = notif
                })
                .catch((err) => {
                  console.log(JSON.stringify(err))
                })
            })
          })
        }

        return n;
      })
    })



  }]);
