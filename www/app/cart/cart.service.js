app.factory("Cart", function($state){

  return {
    menuId : function(array, key, value){
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
      }
      return null;
    }
  }

})
