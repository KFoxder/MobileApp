
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

//Homepage
var home = require('./routes/home');

var http = require('http');
var path = require('path');

var mongo = require('mongodb');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Connect to DB
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	  console.log("Connected to MongoDB!");
	});

//Define Schemas for Party

//Define Enums for Locations
var LOCATIONS = 'Manhattan Brooklyn Queens Bronx Staten'.split(' ');

var PartySchema =  new mongoose.Schema({
    name: {type: String, trim: true},
    location: {type: String, trim: true, enum: LOCATIONS},
    score : {type: Number}
});

var Party = mongoose.model('Party', PartySchema);

//Page routes
app.get('/', routes.index);
app.get('/home', home.home(Party));




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
