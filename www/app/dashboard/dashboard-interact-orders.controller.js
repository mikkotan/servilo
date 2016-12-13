app.controller('DashboardInteractOrdersCtrl', function($scope, $stateParams, Restaurant, Order, User, Menu) {
  var restaurantId = $stateParams.restaurantId;
  $scope.filterType = 'all'
  console.log('dashboard interact orders ctrl');

  Restaurant.getOrders(restaurantId).$loaded()
    .then((orders) => {
      console.log(JSON.stringify(orders));
      $scope.tempOrders = orders

      $scope.orderFilter = function(type) {
        return function(order) {
          order.date = new Date(order.details.order_details.timestamp);
          var today = new Date();
          if (type === 'today') {
            return order.date.getDate() === today.getDate() && order.date.getYear() === today.getYear()
          }
          else if (type === 'all') {

            return order
          }
          else if (type === 'month') {
            var startMonth = new Date();
            var endMonth = new Date();
            startMonth.setDate(1)
            endMonth.setDate(31)

            return order.date.getDate() >= startMonth.getDate() && order.date.getDate() <= endMonth.getDate() && order.date.getYear() === today.getYear()
          }
        }
      }

      $scope.setFilter = function(type) {
        $scope.filterType = type
      }

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
