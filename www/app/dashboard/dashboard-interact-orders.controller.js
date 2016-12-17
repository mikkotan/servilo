app.controller('DashboardInteractOrdersCtrl', function($scope, $stateParams, Restaurant, Order, User, Menu, CordovaGeolocation, $ionicModal) {
  var restaurantId = $stateParams.restaurantId;
  $scope.filterType = 'all'
  $scope.currentLocation = CordovaGeolocation.get();

  console.log('dashboard interact orders ctrl');
  $scope.modalControl ={};
  $scope.restaurant  = Restaurant.get(restaurantId);

  $scope.navigate = function(order){
    let waze = launchnavigator.APP.WAZE
    launchnavigator.isAppAvailable(waze, function(isAvailable){
      let app = { app : waze }
        if(isAvailable){
            launchnavigator.navigate([order.details.order_details.latitude , order.details.order_details.longitude], app)
        }else{
            console.log("Please install waze");
        }
    });
  }

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

    $scope.walkInOrder = function(){
      $state.go('tabs.viewRestaurant.main',{restaurantId:restaurantId});
      console.log("walk in order has been clicked");
    }

    $scope.changeOrderStatus = function(orderId, key, val) {
      console.log('orderId: ' + orderId);
      console.log('key: ' + key);
      console.log('val: ' + val);
      return Order.updateStatus(orderId, key, val);
    }
    $scope.markers = [];
    // $scope.markers.push({
    //   id: Date.now(),
    //   coords: {
    //     latitude: $scope.order.latitude,
    //     longitude: $scope.order.longitude
    //   }
    // });

    $scope.map = {
        center: {
          latitude: 10.729984,
          longitude: 122.549298
        },
        zoom: 12,
        options: {
          scrollwheel: false
        },
        bounds: {},
        control: {},
        refresh: true,
        events: {
          tilesloaded: function(map) {
            google.maps.event.trigger(map, "resize");
          }
        }
      };

      $scope.pathByRestaurant = function(order){
          $scope.showPath($scope.restaurant.latitude, $scope.restaurant.longitude, order.latitude, order.longitude);
      };
      $scope.pathByCurrentLocation = function(order){
        $scope.currentLocation = CordovaGeolocation.get();
        $scope.showPath($scope.currentLocation.latitude, $scope.currentLocation.longitude, order.latitude, order.longitude);
      };
      $scope.mapDirection =[];
      $scope.showPath = function(fromLat, fromLng, toLat, toLng) {
        $scope.mapDirection =[];
        console.log(fromLat+"::"+ fromLng+"::"+ toLat+"::"+ toLng)
        $scope.map.zoom = 12;
        var mapDirection = new google.maps.DirectionsService();
        var request = {
          origin: {
            lat: fromLat,
            lng: fromLng
          },
          destination: {
            lat: toLat,
            lng: toLng
          },
          travelMode: google.maps.DirectionsTravelMode['DRIVING'],
          optimizeWaypoints: true
        };
        $scope.markers.length = 1;

        $scope.markers.push({
          id: Date.now(),
          coords: {
            latitude: fromLat,
            longitude: fromLng
          }
        });

        mapDirection.route(request, function(response, status) {
          var steps = response.routes[0].legs[0].steps;
          var distance = response.routes[0].legs[0].distance.value / 1000;
          distance = distance.toFixed(2);
          for (i = 0; i < steps.length; i++) {
            var strokeColor = '#049ce5';
            if ((i % 2) == 0) {
              strokeColor = '#FF9E00';
            }
            $scope.mapDirection.push({
              id: i,
              paths: steps[i].path,
              stroke: {
                color: strokeColor,
                weight: 5
              }
            });
          }
          $scope.markers[0].icon = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_bubble_icon_texts_big&chld=flag|edge_bc|FFBB00|000000|Orders+Here');
          $scope.$apply();
        });
      };

      $ionicModal.fromTemplateUrl('app/dashboard/_popout-orders-google-maps.html', function(mapModal) {
        $scope.mapModal = mapModal;
      }, {
        scope: $scope
      });

      $scope.openMapModal = function(order){
        $scope.mapModal.show();
        $scope.modalControl.refresh({
          latitude: order.details.order_details.latitude,
          longitude: order.details.order_details.longitude
        });
        $scope.order = order;
        $scope.markers.push({
          id: Date.now(),
          coords: {
            latitude: order.details.order_details.latitude,
            longitude: order.details.order_details.longitude
          }
        });
      }

})
