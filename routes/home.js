
/*
 * GET home page.
 */



exports.home = function(Party){


var ReturnVal = function(req, res){

  Party.find(function(err, parties){
  		if(err){
  			console.log(err);
  		}else{
  			console.log(parties);

  			res.render('home', { 
  				title: 'Party Trender',
  				parties: parties
  			});
  		}
  });

  
};

return ReturnVal;
};