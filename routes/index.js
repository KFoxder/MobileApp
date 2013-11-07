
/*
 * GET home page.
 */
var check = require('validator').check
, sanitize = require('validator').sanitize
, db = require('../models/dbSchema.js');

exports.homepage = function(req, res){

  res.render('home');

};

exports.new = function(req,res){
res.render('new');


};
exports.profile = function(req,res){

res.render('profile', { _USERNAME : req.user.username});

};

exports.logout = function(req,res){
	req.logout();
  	res.redirect('/');
};

exports.login = function(req,res){
	res.redirect('/');
};

exports.account = function(req,res){

	res.render('account',
		{
			_USERNAME : req.user.username,
			_EMAIL : req.user.email,
			_DATEJOINED : req.user.dateCreated
		});

};
exports.signup = function(req,res){
	var tempusername = sanitize(req.body.username).trim();
	var temppass1 = req.body.password1;
	var temppass2 = req.body.password2;
	var tempemail = sanitize(req.body.email).trim();
	var isValidEmail = true;
	try{
		check(tempemail).isEmail();
	}catch(e){
		isValidEmail = false;
		console.log(e.message);
	}
	if((temppass2 != temppass1) || tempusername == '' || !isValidEmail){
		res.redirect('/new');
	}else{
		var user = new db.userModel({ username: tempusername, email: tempemail, password: temppass1 });
		user.save(function(err) {
	  			if(err) {
	  			console.log("ERROR SAVING!");
	    		console.log(err);
	    		res.redirect('/new');
	  		} else {
	  			//Console Log that we added the user
	    		console.log('user: ' + user.username + " saved.");
	    		//Login the User straight away
				req.login(user, function(err) {
	        		if (err) {
	          		console.log(err);
	        		}
	        		return res.redirect('/profile');
	      		});
	  		}
		});
	}
}