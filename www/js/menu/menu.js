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
      prevPrice : menu.price,
      timestamp : firebase.database.ServerValue.TIMESTAMP
    }).then(function(menuObj){
      var restaurantRef = firebase.database().ref().child("restaurants").child(restaurantId);

      restaurantRef.child("menus").child(menuObj.key).set(true);
    })
    $state.go('tabs.restaurant');
  }

  $scope.deleteMenu = function(menu) {
    var resSumRef = firebase.database().ref().child("restaurants").child(menu.restaurant_id).child("sumPrice");
    var resTotalMenuCountRef = firebase.database().ref().child("restaurants").child(menu.restaurant_id).child("totalMenuCount");

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
