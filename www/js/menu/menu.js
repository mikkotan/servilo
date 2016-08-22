app.controller("MenuCtrl",["$scope","$firebaseAuth","$firebaseArray","$firebaseObject", "Menu","$stateParams","$state", "$ionicModal", "$ionicListDelegate",
  function($scope,$firebaseAuth,$firebaseArray,$firebaseObject, Menu , $stateParams , $state, $ionicModal, $ionicListDelegate){

  var restaurantId = $stateParams.restaurantId;

  $scope.menus = Menu.all();
  $scope.getRestaurant = Menu.getRestaurant;
  // $scope.getRestaurantMenus = Menu.getRestaurantMenus(restaurantId);


  $scope.restaurant = function(restid){
    var rest = Menu.getRestaurant(restid);
    return  restid;
  }

  $scope.addMenu = function(menu){
    $scope.menus.$add({
      name : menu.name,
      price : menu.price,
      restaurant_id : restaurantId,
      prevPrice : menu.price
    }).then(function(menuObj){
      var restaurantRef = firebase.database().ref().child("restaurants").child(restaurantId);
      var sumRef = restaurantRef.child("sumPrice");
      var menuCount = restaurantRef.child("totalMenuCount");
      var avgRate = restaurantRef.child("rating");

      restaurantRef.child("menus").child(menuObj.key).set(true);

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

  $scope.deleteMenu = function(menu) {
    console.log("deleted click"+ menu.name);
    console.log("price"+menu.price);
    var resSumRef = firebase.database().ref().child("restaurants").child(menu.restaurant_id).child("sumPrice");
    var resTotalMenuCountRef = firebase.database().ref().child("restaurants").child(menu.restaurant_id).child("totalMenuCount");
    resSumRef.transaction(function(currentSum){
      return currentSum - menu.price;
    });

    resTotalMenuCountRef.transaction(function(currentCount){
      return currentCount - 1;
    });


    $scope.restaurantMenus.$remove(menu);
  }

  $scope.editMenu = function(menu) {
    console.log("editButtonModal clicked");
    $scope.menu = menu;
    $scope.menuEditModal.show();
  }

  $scope.updateMenu = function(menu, $state) {
    var menuRef = firebase.database().ref().child("menus").child(menu.$id);
    menuRef.update({
      name : menu.name,
      price : menu.price
    }).then(function() {
      var resSumRef = firebase.database().ref().child("restaurants").child(menu.restaurant_id).child("sumPrice");
      var prevPriceRef = menuRef.child("prevPrice");

      resSumRef.transaction(function(currentSum){
        return currentSum - menu.prevPrice + menu.price;
      })

      prevPriceRef.transaction(function(currentPrevPrice){
        return menu.price;
      })
    });

    $scope.menuEditModal.hide();
    $ionicListDelegate.closeOptionButtons();
  }

  $ionicModal.fromTemplateUrl('templates/edit-menu.html', function(modalEditMenu) {
    $scope.menuEditModal = modalEditMenu;
  }, {
    scope: $scope
  });


  if($state.is("tabs.viewRestaurantMenus")){
    $scope.restaurantMenus = Menu.getRestaurantMenus(restaurantId);
  }

}]);
