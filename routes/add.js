
/*
 * GET home page.
 */



exports.show = function(){


var ReturnVal = function(req, res){

  res.render('add', { 
  			title : "Adding a Party to the List"
  			});

  
};

return ReturnVal;
};

exports.add = function(PartyModel){

	
}