var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  config    = require('../../config/config'),
  auth = require('../../config/validateRequest'),
  User = mongoose.model('User'),
  Feed = mongoose.model('Feed'),
  _url  = require('url'),
  auth = require('../../config/validateRequest'),
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
        if(!err){
          current_user.feed_ids.push(feed._id);
          current_user.save(function(err){
            console.log(current_user);
            console.log(err);
          });
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
