
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')

//Homepage
, http = require('http')
, path = require('path')

, mongo = require('mongodb')
, mongoose = require('mongoose')
, mongoStore = require('connect-mongodb')
, passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, bcrypt = require('bcrypt')
, SALT_WORK_FACTOR = 10
, db = require('./models/dbSchema.js')
, pass = require('./models/pass.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/photos' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'SECRET' }));
// Remember Me middleware
 app.use( function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
      if ( req.body.rememberme ) {
        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
  });
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));



// development only
if ('dev' == app.get('NODE_ENV')) {
  app.use(express.errorHandler());
}

//Page routes GET
app.get('/', pass.isLoggedIn,routes.homepage);
app.get('/new', pass.isLoggedIn, routes.new);
app.get('/profile', pass.ensureAuthenticated, routes.profile);
app.get('/logout', routes.logout);
app.get('/login', routes.login);
app.get('/account', pass.ensureAuthenticated, routes.account);
app.get('/signup',routes.login);
app.get('/uploadPhoto',routes.login);
app.get('/myphotos',pass.ensureAuthenticated, routes.myphotos);
app.get('/deletePhoto/:name?', pass.ensureAuthenticated, routes.deletePhoto);
app.get('/updatePhoto/:name?/:rating?', pass.ensureAuthenticated, routes.updatePhoto);
app.get('/photosRated',pass.ensureAuthenticated, routes.photosRated);
app.get('/photoFocus/:name?',pass.ensureAuthenticated,routes.photoFocus);


//Page routes POST
app.post('/login',  passport.authenticate('local', { successRedirect: '/profile',
                                   					failureRedirect: '/',
                                   					failureFlash: false }));
app.post('/signup', routes.signup);
app.post('/uploadPhoto', pass.ensureAuthenticated , routes.uploadPhoto);


//HTTP SERVER
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
