var mongoose = require('mongoose')
	, bcrypt = require('bcrypt')
	, SALT_WORK_FACTOR = 10;

exports.mongoose = mongoose;

var uriString = 'mongodb://nodejitsu_kfox2010:3u0gu354meqcoi8mhqno35648p@ds045978.mongolab.com:45978/nodejitsu_kfox2010_nodejitsudb3411343009';

mongoose.connect(uriString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB!");
});

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  dateCreated: { type: Date},
  photos: [mongoose.Schema.Types.ObjectId]
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
        var user = this;
        user.dateCreated = new Date();
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

// User Model
var userModel = mongoose.model('User', userSchema, 'UserCollection');


//Photo Model
var photoSchema = new mongoose.Schema({

	photoLink: {type: String, required: true},
	dateAdded: {type: Date, default: Date.now, required: true},
	numberOfRate: {type: Number, Min: 0, default: 0, required: true},
	currentRating: {type: Number, Min: 0, default: 0, required: true}
});

photoSchema.pre('save', function(next){

	var photo = this;
	var photoID = this._id;
	

	return next();

});

var photoModel = mongoose.model('Photo', photoSchema, 'PhotoCollection');


//Exports 
exports.userModel = userModel;
exports.photoModel = photoModel;






