var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  jwt       = require('jwt-simple'),
  config    = require('../../config/config'),
  auth = require('../../config/validateRequest'),
  User = mongoose.model('User'),
  Feed = mongoose.model('Feed');

var users = {
  find_all: function(req, res){
    auth.authencation(req, res, function(current_user){
      User.find({}, function(err, users){
        if(err) return res.json(401, {error: err});
        return res.json(200, users);
      });
    });
  },
  me: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, current_user);
    })
  },
  add_friend: function(req, res){
    auth.authencation(req, res, function(current_user){
      User.findOne({_id: req.body.user_id}, function(err, user){
        if(err) return res.json(401, {error: err});
        if(user === undefined) return res.json(401, {error: 'Not found.'});
        var requested_friends_ids = user.requested_friends_ids;
        if(requested_friends_ids.indexOf(current_user.id) == -1){
          user.requested_friends_ids.push(current_user.id)
          user.save(function(err){
            if(err) return res.json(401, {error: err});
            return res.json(200)
          })
        }
        return;
      });
    });
  },
  get_requested_friends_list: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, getFriendOrFollowerings(current_user, 'requested_friend'));
    });
  },
  accepted_friend: function(req, res){
    auth.authencation(req, res, function(current_user){
      acceptedFriend(current_user.id, req.body.friend_id);
      acceptedFriend(req.body.friend_id, current_user.id);
    });
    return res.json(200);
  },
  get_friends_list: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, getFriendOrFollowerings(current_user))
    });
  },
  follow_user: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, followed(current_user, req.body.user_followed_id));
    });
  },
  get_followers_list: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, getFriendOrFollowerings(current_user, 'follower'));
    });
  },
  get_followings_list: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, getFriendOrFollowerings(current_user, 'following'));
    });
  },
  get_feeds: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, getFeeds(current_user));
    });
  },
  like: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, like(current_user, req.body.feed_id, 'like'));
    });
  },
  unlike: function(req, res){
    auth.authencation(req, res, function(current_user){
      return res.json(200, like(current_user, req.body.feed_id, 'unlike'));
    });
  }
}

module.exports = function (app) {
  app.use('/', router);
};

// GET All users
router.get('/api/v1/users', users.find_all);
router.get('/api/v1/users/me', users.me);
router.get('/api/v1/users/me/friends', users.get_friends_list);
router.get('/api/v1/users/me/request_friends', users.get_requested_friends_list);
router.get('/api/v1/users/me/feeds', users.get_feeds);
router.put('/api/v1/users/me/add_friend', users.add_friend);
router.put('/api/v1/users/me/accepted_friend', users.accepted_friend);
router.put('/api/v1/users/me/add_follow', users.follow_user);
router.put('/api/v1/users/me/followings', users.get_followings_list);
router.put('/api/v1/users/me/followeds', users.get_followers_list);
router.put('/api/v1/users/me/like', users.like);
router.put('/api/v1/users/me/unlike', users.unlike);


// Accepted Friends Invite
function acceptedFriend(user_id, friend_id){
  User.findOne({_id: user_id}, function(err, user){
    if(err) return {error: err};
    if(user.friend_ids.indexOf(friend_id) == -1){
      user.friend_ids.push(friend_id)
      var index = user.requested_friends_ids.indexOf(friend_id);
      if (index > -1) {
        user.requested_friends_ids.splice(index, 1);
      }
      user.save(function(err){
        if(err) return {error: err};
        return user;
      });
    }
  });
}

// GET FriendList via user
function getFriendOrFollowerings(current_user, type){
  var ids = [];
  var type = type || 'friend';
  switch(type){
    case 'follower':
      ids = current_user.follower_ids;
      break;
    case 'following':
      ids = current_user.following_ids;
      break;
    case 'requested_friend':
      ids = current_user.requested_friends_ids;
      break;
    default:
      ids = current_user.friend_ids;
      break;
  }

  User.find({_id: {$in: ids}}, function(err, users){
    if(err) return [];
    return users;
  })
}

// Followed user
function followed(current_user, user_followed_id){
  User.findOneAndUpdate({_id: user_followed_id}, {$push: {following_ids: current_user.id}}, function(err, user){
    if(!err){
      current_user.follower_ids.push(user_followed_id);
      current_user.save(function(err){
      });
    }
    return ;
  });
}

// GET Feeds via user
function getFeeds(current_user){
  var feed_ids = current_user.feed_ids;
  if(feed_ids.length < 1) return [];
  Feed.find({_id: {$in: feed_ids}}, function(err, feeds){
    if(err) return [];
    return feeds;
  });
}

// LIKE Feed via user
function like(current_user, feed_id, type){
  var type = type || 'like';
  var query = '';
  switch(type){
    case 'like':
      query = {$inc: {like_count: 1}, $push: {user_like_ids: current_user.id}};
      break;
    case 'unlike':
      query = {$inc: {like_count: -1}, $pull: {user_like_ids: current_user.id}};
      break
  }

  Feed.findOneAndUpdate({_id: feed_id}, query, function(err, feed){
    return feed;
  });
}

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
  return dateObj.setDate(dateObj.getDate() + numDays);
}