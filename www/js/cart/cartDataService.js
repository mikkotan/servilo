app.factory('CartData', function(){

  var cart = [];

  return {
    add: function(menu) {
        cart.unshift(menu);
    },
    get: function(){
      console.log("hi "+ cart);
      return cart;
    }

  };

});
