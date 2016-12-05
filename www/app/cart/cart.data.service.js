app.factory('CartData', function(){

  var cart = [];
  var totalPrice =[];

  return {
    add: function(menu) {
        cart.unshift(menu);
    },
    get: function(){
      return cart;
    },
    totalPrice : function(){
      return totalPrice
    }

  };

});
