app.filter('food',['Menu','Restaurant',function(Menu , Restaurant){
  return function(input){
    if(isNaN(input)){
      input = input + "haha";
    }
    return input;
  }

}])
