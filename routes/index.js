
/*
 * GET home page.
 */
var check = require('validator').check
, sanitize = require('validator').sanitize
, db = require('../models/dbSchema.js');

exports.homepage = function(req, res){

  res.render('home');

};
exports.myphotos = function(req, res){

	//Gets an Array of Photo ObjectIds for the user
	var photoIDs = req.user.photos.toObject();
	var photoLinks = new Array();
	var photoScores = [];
	var waiting = 0;

	for (var i = photoIDs.length - 1; i >= 0; i--) {
		console.log("Photo ID : "+photoIDs[i]);
		waiting++;

		db.photoModel.findById(photoIDs[i],function(err,doc){
			if(err){
				console.log('ERROR FINDING PHOTO WITH ID' + err);
			}else{
				waiting--;
				console.log("Photo Link : "+doc.photoLink);
				console.log("Photo Score : "+doc.photoScore);
				photoLinks.push(doc.photoLink);
				photoScores.push(doc.currentRating);
				complete();

			}
		});
	};

	//Callback function when iterating is done
	function complete(){
	if(waiting==0)
	{
		console.log("Array of Links : "+photoLinks);
		console.log("Array of Links : "+photoScores);
		res.render('myphotos',{
		_USERNAME : req.user.username,
		_PHOTOS: photoLinks
		});
	}
	};






};
exports.addPhoto = function(req,res){

	var photo = new db.photoModel({photoLink: 'https://lh4.googleusercontent.com/-oqGrC6ew0Mk/AAAAAAAAAAI/AAAAAAAAAAA/R2DfnA227qE/photo.jpg'});
	var user = req.user;
	photo.save(function(err){
	if(err){
		console.log('ERROR SAVING : '+err);
	};

	//Push new Photo onto current user and save
	user.photos.push(photo.id);
	user.save();
	//console.log(req.user.photos);

	var username = user.username;
	var photoIDs = req.user.photos.toObject();
	var photoModel = db.photoModel;

	for (var i = photoIDs.length - 1; i >= 0; i--) {
		console.log(photoIDs[i]);
		db.photoModel.findById(photoIDs[i],function(err,doc){
			if(err){
				console.log('ERROR FINDING PHOTO WITH ID' + err);
			}else{
				console.log(doc.photoLink);
			}
		});
	};

});
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