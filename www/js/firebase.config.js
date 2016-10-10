app.provider("firebaseConfig",function(){

  this.config = {
    apiKey: "AIzaSyA9E-lSM2WKmonVkHCShv_ErYuvobxgb40",
    authDomain: "jepsrestaurantdev.firebaseapp.com",
    databaseURL: "https://jepsrestaurantdev.firebaseio.com",
    storageBucket: "jepsrestaurantdev.appspot.com",
  }

  this.$get = function() {
        return this.config
    };
})
