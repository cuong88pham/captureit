var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  jwt       = require('jwt-simple'),
  config    = require('../../config/config'),
  User = mongoose.model('User');
var user = {
  sign_up: function(req, res){
    var username = req.body.username || '',
        email    = req.body.email || '',
        password = req.body.password || '';

    if(username == '' || email == '' || password == ''){
      return res.json(401, {error: 'Username, Email and password is required.'});
    }
    var user = new User()
    user.username = username;
    user.email    = email;
    user.password = password;
    user.save(function(err){
      if(err){
        return res.json(401, {error: err});
      }
      return res.json(200, user);
    });
  },
  sign_in: function(req, res){
    // Validate Email & Password
    var email = req.body.email || '',
        password = req.body.password || '',
        changeToken = req.body.change_token || false;

    if(email == '' || password == ''){
      return res.json(401, {error: 'Email or password is required.'});
    }

    User.findOne({email: email}, function(err, user){
      if(err){
        return res.json(401, {error: err});
      }

      if(user == undefined){
        return res.json(401, {error: 'This user is not exited.'});
      }

      user.comparePassword(password, function(isMatch){
        if(!isMatch){
          return res.json(401, {error: 'Your password is incorrect.'});
        }
        // Change Token when login first time or request change token
        console.log(user.auth_token, changeToken);
        if(!user.auth_token || changeToken == true){
          token = genToken(user).token;
          user.auth_token = token;
          user.save(function(err){
            if(err) return res.json(401, {error: err});
            return res.json(200, user);
          });
        }
        return res.json(200, user);
      });
    });
  },
  sign_out: function(req, res){
    if(req.user){
      expireToken(req.header);
      delete req.user;
      return res.json(200, {msg: 'Logout Success.'})
    }else{
      return res.json(401);
    }
  }
}

module.exports = function (app) {
  app.use('/', router);
};

router.post('/api/v1/auth/sign_up', user.sign_up);
router.post('/api/v1/auth/sign_in', user.sign_in);
router.post('/api/v1/auth/sign_out', user.sign_out);

// General Token
function genToken(user){
  var expires = expireIn(365),
  token = jwt.encode({
    exp: expires
  }, config.secret);

  return {token: token, expires: expires, user: user};
}

function expireIn(numdays){
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numdays);
}