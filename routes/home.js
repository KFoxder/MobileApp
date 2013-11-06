
/*
 * GET home page.
 */



exports.home = function(PhotoModel){


var ReturnVal = function(req, res){

  
  //res.render('home');
  req.session.message = 'Hello World';
  res.send('Welcome');
  
};

return ReturnVal;
};