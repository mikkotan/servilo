app.factory("Order",["$firebaseAuth","$firebaseArray","$firebaseObject", "Database", "$ionicPopup", "Restaurant", "User", "Notification",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Database, $ionicPopup, Restaurant, User, Notification){

  var rootRef = firebase.database().ref();
  var orders = Database.ordersReference();
  var ordersArray = Database.orders();
  var restaurant = Database.restaurantsReference();


  Order = {
    all : function() {
      return $firebaseArray(orders);
    },
    getOne : function(orderId) {
      console.log('getting one ' + orderId);
      return $firebaseObject(orders.child(orderId));
    },
    getOrder : function(restaurantId){
      return $firebaseArray(orders.orderByChild("restaurant_id").equalTo(restaurantId));
    },
    findOne : function(orderId) {
      console.log("find One order fired");
      return $firebaseObject(Database.ordersReference().child(orderId));
    },
    create : function(order) {
      console.log('Order create function');
      var authObj = firebase.auth().currentUser.uid;
      var pushId = Database.ordersReference().push()
      return pushId.set(order)
        .then(() => {
          console.log('Order Created');
          Database.userOrdersReference().child(authObj).child(pushId.key).set(true)
            .then(() => {
              console.log('userOrder Created')
              return Database.restaurantOrdersReference().child(order.restaurant_id).child(pushId.key).set(true)
            })
        })
    },
    delete : function(order) {
      console.log('delete ordering')
      return Database.ordersReference().child(order).once('value')
        .then((orderObj) => {
          console.log(orderObj);
          var orderId = orderObj.key;
          var customerId = orderObj.val().customer_id;
          var restaurantId = orderObj.val().restaurant_id;
          Database.ordersReference().child(orderId).set(null)
            .then(() => {
              Database.userOrdersReference().child(customerId).child(orderId).set(null)
                .then(() => {
                  return Database.restaurantOrdersReference().child(restaurantId).child(orderId).set(null)
                })
            })
        })
    },
    cancel : function(order) {
      var confirm = $ionicPopup.confirm({
        title: 'Cancel Order',
        template: 'Cancel your Order #' + order.order_details.timestamp + '?',
      })
      .then((res) => {
        if (res) {
          console.log('ress true');
          var orderRef = Database.ordersReference().child(order.$id);
          var orderDetailsRef = orderRef.child('order_details');
          orderDetailsRef.child('status').set('cancelled');
          orderDetailsRef.child('status_time').set(firebase.database.ServerValue.TIMESTAMP);
          orderRef.child('orderStatus').set(null);
          Restaurant.get(order.restaurant_id).$loaded()
            .then((restaurant) => {
              Notification.create({
                sender_id : User.auth().$id,
                restaurant_id : order.restaurant_id,
                receiver_id : restaurant.owner_id,
                type : 'order',
                status : 'cancelled',
                order_no: order.order_details.timestamp,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
            })
            .catch((err) => {
              console.log(err)
            })

        }
        else {
          console.log('Cancel failed');
        }
      })
    },
    updateStatus : function(orderId, key, val) {
      console.log('updating status from Order.service.js');
      var orderRef = Database.ordersReference().child(orderId).child('orderStatus').child(key).set(val);
      var orderStatusRef = Database.ordersReference().child(orderId).child('order_details');
      var ref = Database.ordersReference().child(orderId).child('orderStatus');
      this.findOne(orderId).$loaded()
        .then((order) => {
          var confirmDelete = $ionicPopup.confirm({
            title: "Update Order",
            template: "Update Order #" + order.order_details.timestamp + "?"
          })
          .then((res) => {
            if (res) {
              if (key === 'confirmed' && val === true) {
                ref.child('done').set(false);
                ref.child('confirmed').set(null);
              }
              else if (key === 'done' && val === true) {
                ref.child('onDelivery').set(false);
                ref.child('done').set(null);
              }
              else if (key === 'onDelivery' && val === true) {
                ref.child('delivered').set(false);
                ref.child('onDelivery').set(null);
              }
              else if (key === 'delivered' && val === true) {
                ref.set(null);
                key = 'completed';
              }
              else if (key === 'cancelled' && val === true) {
                ref.set(null);
              }

              if (val === true) {
                orderStatusRef.child('status').set(key);
                orderStatusRef.child('status_time').set(firebase.database.ServerValue.TIMESTAMP);
              }

              Notification.create({
                sender_id: User.auth().$id,
                restaurant_id : order.restaurant_id,
                receiver_id : order.customer_id,
                type : 'order_status',
                status : key,
                order_no: order.order_details.timestamp,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
              console.log('Order Reference :' + orderRef);
            }
            else {
              console.log('Update order cancel');
              // $scope.order.orderStatus[key] = false;
              return false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
        })
    }
  }
  return Order;
}]);
