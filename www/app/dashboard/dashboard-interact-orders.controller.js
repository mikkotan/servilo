app.controller('DashboardInteractOrdersCtrl', function($scope, $stateParams, Restaurant, Order, User, Menu) {
  var restaurantId = $stateParams.restaurantId;
  console.log('dashboard interact orders ctrl');

  Restaurant.getOrders(restaurantId).$loaded()
    .then((orders) => {
      console.log(JSON.stringify(orders));
      $scope.tempOrders = orders

      $scope.$watchCollection('tempOrders', function(newOrders) {
        console.log('wwatching tempOrders collection');
        $scope.orders = newOrders.map(function(order) {
          var o = {
            get : Order.getOne(order.$id).$loaded()
              .then((orderObj) => {
                o.menus = orderObj.order_details.menus;
                console.log('orderObj: '+orderObj);
                o.details = orderObj;
                User.getUser(orderObj.customer_id).$loaded()
                  .then((user) => {
                    o.customer = user.firstName + " " + user.lastName
                  })
                o.menus = o.menus.map(function(menu) {
                  var m = {
                    getMenu : Menu.get(menu.id).$loaded()
                      .then((menuObj) => {
                        m.name = menuObj.name;
                        m.price = menuObj.price;
                        o.ready = true
                      }),
                    quantity : menu.quantity
                  }
                  return m;
                })
              })
          }
          return o;
        })
      })
    })
    .catch((err) => {
      console.log('fail');
      console.log(err);
    })

    $scope.changeOrderStatus = function(orderId, key, val) {
      console.log('orderId: ' + orderId);
      console.log('key: ' + key);
      console.log('val: ' + val);
      return Order.updateStatus(orderId, key, val);
    }


})
