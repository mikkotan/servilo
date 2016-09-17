app.factory('CartDataService', function(){
  var cart = [];
  return {
    add: function(menu) {
        cart.push(menu);
    },
    get: function(){
      return cart;
    }

  }
})
