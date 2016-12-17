  app.factory('CartData', function(Cart){


  var obj = {
      menus : [],
      totalPrice:[]
  }

  var cart = Object.freeze(obj);

  return {
    addMenu: function(menu) {
        cart.menus.unshift(menu)
    },
    addToTotalPrice: function(menu){
      let checkMenu = Cart.menuId(cart.totalPrice, "id", menu.id)
        if(checkMenu === null ){
          cart.totalPrice.push({
            id: menu.id,
            price: menu.price * menu.quantity
          });
        }else{
          cart.totalPrice[checkMenu].price = menu.price * menu.quantity
        }
    },
    setNull : function(){
      cart.menus.length = 0
      cart.totalPrice.length = 0
      console.log(cart)
    },
    get : function(){
      return cart
    },
    isEmpty : function(){
      let value = true
      if(cart.menus.length > 0 && cart.totalPrice.length > 0){
        value = false
      }
      return value
    },
    totalPrice : function(){
      let price = 0;
      for (var i = 0; i < cart.totalPrice.length; i++) {
        price += cart.totalPrice[i].price;
      }
      return price
    }
  };

});
