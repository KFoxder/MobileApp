
//CONNECT TO MONGODB
  var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;


  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
  console.log("Connected to MongoDB!");
  });

//SET ENUMS FOR LOCATIONS
  var LOCATIONS = 'Manhattan Brooklyn Queens Bronx Staten'.split(' ');
  var PartySchema =  new mongoose.Schema({

    name: {type: String, trim: true},
    location: {type: String, trim: true, enum: LOCATIONS},
    score : {type: Number}
    
  });

  var Party = mongoose.model('Party', PartySchema);

exports.getModel = function(){

  return Party;
};


