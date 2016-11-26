app.factory("Order",["$firebaseAuth","$firebaseArray","$firebaseObject", "Database", "$ionicPopup", "Restaurant", "User",
  function($firebaseAuth , $firebaseArray , $firebaseObject, Database, $ionicPopup, Restaurant, User){

  var rootRef = firebase.database().ref();
  var orders = Database.ordersReference();
  var ordersArray = Database.orders();
  var restaurant = Database.restaurantsReference();


  return {
    all : function() {
      return $firebaseArray(orders);
    },
    getOrder : function(restaurantId){
      return $firebaseArray(orders.orderByChild("restaurant_id").equalTo(restaurantId));
    },
    findOne : function(orderId) {
      console.log("find One order fired");
      return $firebaseObject(Database.ordersReference().child(orderId));
    },
    cancel : function(order) {
      console.log('CANCEL CLICKED');
      var confirm = $ionicPopup.confirm({
        title: 'Cancel Order',
        template: 'Cancel your Order #' + order.order_details.timestamp + '?',
      })
      .then((res) => {
        if (res) {
          console.log('ress true');
          var orderRef = Database.ordersReference().child(order.$id);
          orderRef.child('order_details').child('status').set('cancelled');
          orderRef.child('orderStatus').set(null);
          Restaurant.get(order.restaurant_id)
            .then((restaurant) => {
              console.log('then in restaurant');
              Database.notifications().$add({
                sender_id : User.auth().$id,
                receiver_id : restaurant.owner_id,
                restaurant_id : order.restaurant_id,
                type : 'order',
                status : 'cancelled',
                order_no: order.order_details.timestamp,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
                .then(() => { console.log('success')})
                .catch((err) => { console.log(err)})
            })
            .catch((err) => {
              console.log(err)
            })

        }
        else {
          console.log('Cancel failed');
        }
      })
    }
  }
}]);
