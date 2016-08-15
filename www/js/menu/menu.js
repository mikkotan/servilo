app.controller("MenuCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject", "Menu","$stateParams","$state",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams , $state){



  var restaurantId = $stateParams.restaurantId;



  $scope.menus = Menu.all();
  $scope.getRestaurant = Menu.getRestaurant;
  // $scope.getRestaurantMenus = Menu.getRestaurantMenus(restaurantId);


  $scope.restaurant = function(restid){
    var rest = Menu.getRestaurant(restid);
    return  restid;
  }



  $scope.addMenu = function(menu){
    console.log("wew")
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : restaurantId
    }).then(function(){
      console.log("calling callback");
      var restaurantRef = firebase.database().ref().child("restaurants").child(restaurantId);
      var sumRef = restaurantRef.child("sumPrice");
      var menuCount = restaurantRef.child("totalMenuCount");
      var avgRate = restaurantRef.child("rating");

      sumRef.transaction(function(currentPrice){
        console.log("Adding currentPrice");
        return currentPrice + menu.price;
      })

      menuCount.transaction(function(currentCount){
        console.log("Adding count");
        return currentCount+1;
      })

    })
    $state.go('tabs.restaurant');
  }


  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
        // console.log("34"+Menu.getRestaurant(restaurantId));
  }

}]);
