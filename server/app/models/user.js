var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  feed_ids: {type: Array, default: []},
  friend_ids: {type: Array, default: []},
  requested_friends_ids: {type: Array, default: []},
  follower_ids: {type: Array, default: []},
  following_ids: {type: Array, default: []},
  is_admin: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  auth_token: String
});

// EnScript Password before save to database
UserSchema.pre('save', function(next){
  var user = this;
  var friend_ids = user.friend_ids;
  // Check user's password is modified
  if(!user.isModified('password')) return next();
  // Encode password
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });

  // Check friend accepted
  if(user.isModified('friend_ids')){

  }

});

// Check password user input
UserSchema.methods.comparePassword = function(password, cb){
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(isMatch);
  });
}

mongoose.model('User', UserSchema);

