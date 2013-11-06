
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

//Homepage
var home = require('./routes/home');
var add = require('./routes/add');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');
var mongoose = require('mongoose');
var PhotoModelFile = require('./data/schemas/PhotoSchema.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("mySecret"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



//Get PartyModel
var PhotoModel = PhotoModelFile.getModel();

//Page routes
app.get('/', routes.index);
app.get('/home', home.home(PhotoModel));
/*
app.get('/add', add.show());

app.post('/addPhoto', add.add(PhotoModel));

*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
