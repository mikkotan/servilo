app.filter('restaurantFilter',function(Menu){

  return function(restaurants , searchRestaurant){

    var filtered = [];

      if(typeof searchRestaurant !== "undefined"){
        angular.forEach(restaurants,function(restaurant){

          if(restaurant.name.toLowerCase().indexOf(searchRestaurant) > -1){
            if(filtered.indexOf(restaurant) == -1){
              filtered.push(restaurant);
            }

          }
        });

        angular.forEach(Menu.all(),function(menu){
          angular.forEach(restaurants,function(restaurant){
            if(menu.name.toLowerCase().indexOf(searchRestaurant) > -1){
              if(menu.restaurant_id == restaurant.$id){
                if(filtered.indexOf(restaurant) == -1){
                  filtered.push(restaurant);
                }
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
