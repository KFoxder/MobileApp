var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected!");
var LOCATIONS = 'Manhattan Brooklyn Queens Bronx Staten'.split(' ');
var PartySchema =  new mongoose.Schema({
    name: {type: String, trim: true},
    location: {type: String, trim: true, enum: LOCATIONS},
    score : {type: Number}
});

  var Party = mongoose.model('Party', PartySchema);

  var rager = new Party({name : 'Manhattan Rager', location: "Manhattan", score: 20});
  rager.save(function(err,rager){
  	if(err){
  		console.log(err);

  	}else{
  		console.log(rager.name);
  	}
  })


});


