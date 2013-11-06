
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
var mongoStore = require('connect-mongodb');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;


var app = express();


//CONNECT TO MONGODB
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;


  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
  console.log("Connected to MongoDB!");
  });
// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
        var user = this;

        if(!user.isModified('password')) return next();

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if(err) return next(err);

                bcrypt.hash(user.password, salt, function(err, hash) {
                        if(err) return next(err);
                        user.password = hash;
                        next();
                });
        });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
                if(err) return cb(err);
                cb(null, isMatch);
        });
};
//Token Generation
userSchema.methods.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};
// Seed a user
var User = mongoose.model('User', userSchema);
var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
user.save(function(err) {
  if(err) {
  	console.log("ERROR SAVING!");
    console.log(err);
  } else {
    console.log('user: ' + user.username + " saved.");
  }
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//
//   Both serializer and deserializer edited for Remember Me functionality
/*
passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    User.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {

        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if (user._id ) {
    createAccessToken();
  }
});

passport.deserializeUser(function(token, done) {
  User.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
});
*/

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
function isLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/profile');
	}
	
}


//Page routes
app.get('/', isLoggedIn,function(req,res){
res.send("<form action='/login' method='post'>"+
    "<div>"+
        "<label>Username:</label>"+
        "<input type='text' name='username'/>"+
    "</div>"+
    "<div>"+
      "  <label>Password:</label>"+
        "<input type='password' name='password'/>"+
    "</div>"+
 "   <div>"+
        "<input type='submit' value='Log In'/>"+
   " </div>"+
"</form> ");

});

app.get('/signup', function(req,res){

});

app.get('/profile', ensureAuthenticated, function(req,res){
res.send("Pass!");

});
app.get('/fail', function(req,res){
res.send("Failed!")

});

app.post('/login',  passport.authenticate('local', { successRedirect: '/profile',
                                   failureRedirect: '/',
                                   failureFlash: false })
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
