var jwt = require('jwt-simple'),
    mongoose  = require('mongoose'),
    User = mongoose.model('User'),
    config = require('./config');

exports.authencation = function(req, res, next) {
  var token = req.headers['authorization'];

  if(token){
    try{
      var decode_token = jwt.decode(token, config.secret);
      if(decode_token.expires <= Date.now()){
        return res.json(400, {error: 'Token Expired'});
      }
      User.findOne({auth_token: token}, function(err, user){
        if(err){
          return res.json(500, {error: err});
        }
        if(user === null) return res.json(401, {error: "Invalid Token or Key"});
        next(user);
      });
    }catch(err){
      return res.json(500, {error: err});
    }
  }else{
    return res.json(401, {error: "Invalid Token or Key"});
  }
};
