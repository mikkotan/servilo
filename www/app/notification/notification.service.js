app.factory('Notification', ['$firebaseObject', '$firebaseArray', 'Database', 'User',
  function($firebaseObject, $firebaseArray, Database, User) {

    var Notification = {
      getOne : function(notificationId) {
        console.log("service "+notificationId);

        return $firebaseObject(Database.notificationsReference().child(notificationId))
      },
      markRead : function(notification) {
        var notifRef = Database.notificationsReference().child(User.auth().$id).child(notification.$id);
        var notifObj = $firebaseObject(notifRef);
        notifObj.$remove()
          .then(() => { console.log('successfully deleted') })
          .catch((err) => { console.log(err) })
      },
      markReadAll : function(notifications) {
        angular.forEach(notifications, (notification) => {
          // var notifRef = Database.notificationsReference().child(User.auth().$id);
          // $firebaseObject(notifRef).$remove()
          //   .then(() => { console.log('successfully deleted all') })
          //   .catch((err) => { console.log(err) })
          this.delete(notification)
            .then(() => {
              console.log('Successfully deleted')
            })
            .catch((err) => {
              console.log(err);
            })
        })
      },
      create : function(notification) {
        var userNotifsRef = Database.userNotificationsReference().child(notification.receiver_id)
        var pushId = Database.notificationsReference().push()
        return pushId.set(notification)
          .then(() => {
            console.log('success');
            return userNotifsRef.child(pushId.key).set(true)
          })
          .catch((err) => {
            return err
          })
      },
      delete : function(notification) {
        var notifId = notification.$id;

        return Database.notificationsReference().child(notifId).set(null)
          .then(() => {
            console.log('going here');
            return Database.userNotificationsReference().child(User.auth().$id).child(notifId).set(null)
          })
          .catch((err) => {
            return err
          })
      }
    }


    return Notification
  }])
