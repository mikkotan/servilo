app.provider("firebaseConfig", function() {

  this.config = {
    apiKey: "AIzaSyA9E-lSM2WKmonVkHCShv_ErYuvobxgb40",
    authDomain: "jepsrestaurantdev.firebaseapp.com",
    databaseURL: "https://jepsrestaurantdev.firebaseio.com",
    storageBucket: "jepsrestaurantdev.appspot.com",
    messagingSenderId: "155324175920"
  };


  this.$get = function() {
    return this.config
  };
})
