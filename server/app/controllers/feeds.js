var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  config    = require('../../config/config'),
  auth = require('../../config/validateRequest'),
  User = mongoose.model('User'),
  Feed = mongoose.model('Feed'),
  _url  = require('url'),
  cheerio = require("cheerio");

var feeds = {
  find_all: function(req, res){
    Feed.find({}, function(err, feeds){
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
    var url = req.body.url;
    var request = require("request");
    request({
      uri: url,
    }, function(error, response, body) {
      $ = cheerio.load(body);
      var params = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        url: url,
        domain: _url.parse(url).hostname
      }
      Feed.create(params, function(err, feed){
        return res.json(200, feed);
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
