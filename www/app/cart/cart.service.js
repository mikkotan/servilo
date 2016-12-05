app.factory("Cart", function(CartData , $state){

  return {

    menuId : function(array, key, value){
        for (var i = 0; i < array.length; i++) {
          if (array[i][key] == value) {
              return i;
          }
        }
        return null;
      },

    isEmpty : function(){
        let isEmpty = true
        if(CartData.get().length > 0){
          isEmpty = false
        }
        return isEmpty;
      },
      setNull : function(){
        CartData.get().length = 0
        CartData.totalPrice().length = 0
      }
  }

})
