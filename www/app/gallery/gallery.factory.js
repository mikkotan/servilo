app.factory("Gallery", [
  function(){

  var savedData = {}

  function set(data) {
    var items = [];
    for (var key in data) {
      items.push(data[key]);
    }
    savedData = items;
  }

  function get() {
    return savedData;
  }

  return {
    set: set,
    get: get
  }
  
}])