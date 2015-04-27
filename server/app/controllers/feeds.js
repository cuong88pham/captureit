var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  config    = require('../../config/config'),
  auth = require('../../config/validateRequest'),
  User = mongoose.model('User'),
  Feed = mongoose.model('Feed'),
  _url  = require('url'),
  auth = require('../../config/validateRequest'),
  async = require('async'),
  request = require('request'),
  fs      = require('fs'),
  cheerio = require("cheerio");

var feeds = {
  find_all: function(req, res){
    Feed.find({},{}, {sort: {created_at: -1}}, function(err, feeds){
      return res.json(200, feeds);
    });
  },
  find: function(req, res){
    Feed.findOne({_id: req.params.id}, function(err, feed){
      if(err) return res.json(401, {error: err});
      return res.json(200, feed);
    })
  },
  create: function(req, res){
    auth.authencation(req, res, function(current_user){
      Feed.create(req.body, function(err, feed){
        if(err && err.code == 11000){
          Feed.findOne({title: req.body.title}, function(err, data){
            if(err) return res.json(401, {error: err});
            has_many_feeds_users(data, current_user);
            return res.json(200, data);
          });
        }
        if(!err){
          has_many_feeds_users(feed, current_user);
          save_page(req.body.url, feed._id+'.html', request);
          return res.json(200, feed);
        }
      });
    });
  }
}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/v1/feeds', feeds.find_all);
router.get('/api/v1/feeds/:id', feeds.find);
router.post('/api/v1/feeds', feeds.create);

function save_page(url, filename, request){
  request(url, function(err, res, body){
    if(!err){
      console.log(config.root+"/public/files");
      fs.writeFile('public/files/'+filename, body, function(err){
        if(err){
          console.log(err);
        }
      })
    }
  })
}

function has_many_feeds_users(feed, current_user){
  async.parallel([
    function(callback){
      if(feed.user_ids.indexOf(current_user._id) == -1){
        feed.user_ids.push(current_user._id);
        feed.save(function(err){
          callback(err);
        });
      };
    },
    function(callback){
      if(current_user.feed_ids.indexOf(feed._id) == -1){
        current_user.feed_ids.push(feed._id);
        current_user.save(function(err){
          callback(err);
        });
      };
    }
  ], function(err, results){

  });

}