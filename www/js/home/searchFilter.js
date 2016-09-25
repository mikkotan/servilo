app.filter('restaurantFilter',function(Menu){

  return function(restaurants , searchRestaurant){

    var filtered = [];

    if(searchRestaurant !== ""){
      angular.forEach(restaurants,function(restaurant){
        if(restaurant.name.indexOf(searchRestaurant) > -1){
          filtered.push(restaurant);
        }
      });
      angular.forEach(Menu.all(),function(menu){
        angular.forEach(restaurants,function(restaurant){
          if(menu.name.indexOf(searchRestaurant) > -1){
            if(menu.restaurant_id == restaurant.$id){
                filtered.push(restaurant);
            }
          }
        });
      });

    }else{
      angular.forEach(restaurants,function(restaurant){
        filtered.push(restaurant);
      });
    }
      return filtered;
  };
});
