app.factory('Notification', ['$firebaseObject', '$firebaseArray', 'Database',
  function($firebaseObject, $firebaseArray, Database) {

    var Notification = {
      markRead : function(notification) {
        var notifRef = Database.notificationsReference().child(notification.$id);
        var notifObj = $firebaseObject(notifRef);
        notifObj.$remove()
          .then(() => { console.log('successfully deleted') })
          .catch((err) => { console.log(err) })
      },
      markReadAll : function(notifications) {
        angular.forEach(notifications, (notification) => {
          var notifRef = Database.notificationsReference().child(notification.$id);
          $firebaseObject(notifRef).$remove()
            .then(() => { console.log('successfully deleted all') })
            .catch((err) => { console.log(err) })
        })
      }
    }

    return Notification
  }])
