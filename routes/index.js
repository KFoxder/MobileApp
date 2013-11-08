
/*
 * GET home page.
 */
var check = require('validator').check
, sanitize = require('validator').sanitize
, db = require('../models/dbSchema.js')
, fs = require('fs')
, path = require('path');

exports.homepage = function(req, res){

  res.render('home');

};
exports.myphotos = function(req, res){

	//Gets an Array of Photo ObjectIds for the user
	var photoIDs = req.user.photos.toObject();
	var photoLinks = new Array();
	var photoScores = new Array();
	var waiting = 0;

	//Loop through photoIDs for the user and adds them to the above array
	for (var i = photoIDs.length - 1; i >= 0; i--) {
		
		waiting++;
		db.photoModel.findById(photoIDs[i],function(err,doc){
			if(err){
				console.log('ERROR FINDING PHOTO WITH ID' + err);
			}else{
				waiting--;
				//console.log("Photo Link : "+doc.photoLink);
				//console.log("Photo Score : "+doc.photoScore);
				if(doc){
					photoLinks.push(doc.photoLink);
					photoScores.push(doc.currentRating);
				}
				complete();

			}
		});
	
	};

	//Callback function when iterating is done
	function complete(){
	if(waiting==0)
	{
		if(photoLinks.length < 1){
			photoLinks = ['/photos/noUpload.jpg'];
		}
		res.render('myphotos',{
		_USERNAME : req.user.username,
		_PHOTOS: photoLinks
		});
	}
	};

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

exports.uploadPhoto = function(req,res){
	if(req.files){
		console.log(req.files);
		fs.readFile(req.files.photo.path, function (err, data) {
		  // ...
		  /*
		  var newPath ="./photos/newFile.png";
		  fs.writeFile(newPath, data, function (err) {
		  	if(err){
		  		console.log(err);
		  	}
		  	});
		  */

		  	//Create new Photo object and save to mongoDB!!
		  	//Get the photo name and add it to /photos/ since we know thats
		  	//where all photos are stored.

		  	var photoName = path.basename(req.files.photo.path);
		  	var photoPath = '/photos/'+photoName;
		  	var photo = new db.photoModel({photoLink:photoPath});
		  	photo.save();
		  	var photoID = photo.id;
		  	req.user.photos.push(photoID);
		  	req.user.save();
		    res.redirect("myphotos");
		  
		});
	}else{
		res.redirect('profile');
	}
	
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