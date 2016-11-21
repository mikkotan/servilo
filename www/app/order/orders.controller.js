app.controller("OrderCtrl",["$scope","restaurants","Restaurant","User","Menu", "Database", "Order", "$ionicPopup",
  function($scope, restaurants, Restaurant, User, Menu, Database, Order, $ionicPopup){

    $scope.restaurants = restaurants.map(function(restaurant){
      return {
          restaurant : restaurant,
          orders : Restaurant.getOrders(restaurant.$id)
      }
    });

    $scope.customer_name = User.getUserFullname;
    $scope.orderMenu = Menu.get;

    $scope.changeOrderStatus = function(orderId, key, val) {
      console.log('changed order status clicked');
      var orderRef = Database.ordersReference().child(orderId).child('orderStatus').child(key).set(val);
      var order = Order.findOne(orderId);
      var orderStatusRef = Database.ordersReference().child(orderId).child('order_details').child('status');
      var ref = Database.ordersReference().child(orderId).child('orderStatus');
      console.log("Order #" + order.order_details.timestamp);

      var confirmDelete = $ionicPopup.confirm({
        title: "Update Order",
        template: "Update Order #" + order.order_details.timestamp + "?"
      })

      confirmDelete
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

            orderStatusRef.set(key);

            Database.notifications().$add({
              sender_id : User.auth().$id,
              receiver_id : order.customer_id,
              restaurant_id : order.restaurant_id,
              type : 'order_status',
              status : key,
              order_no: order.order_details.timestamp,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
              .then(() => {
                console.log("success");
              })
              .catch((err) => {
                console.log(err);
              })
            console.log('Order Reference :' + orderRef);
          }
          else {
            console.log('Update order cancel');
          }
        })
        .catch((err) => {
          console.log(err);
        })


    }
}]);
