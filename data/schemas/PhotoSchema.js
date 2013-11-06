
//CONNECT TO MONGODB
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;


  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
  console.log("Connected to MongoDB!");
  });


  var PhotoSchema =  new mongoose.Schema({

    username: {type: String, trim: true},
    location: {type: String, trim: true},
    likes: {type: Number, Min: 0},
    dislikes: {type: Number, Min: 0},
    photolink: {type: String, trim: true},
    dateadded: {type: Date}

  });

var Photo = mongoose.model('Photo', PhotoSchema);

exports.getModel = function(){

  return Photo;
};


