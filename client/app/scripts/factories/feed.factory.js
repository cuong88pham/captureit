'use strict';
var base_url_api = 'http://localhost:3000/api/v1/';
myApp.factory('FeedFactory', function($window, $http){
  return {
    getAll: function(){
      return $http.get(base_url_api+'feeds')
    },
    find_by_id: function(feed_id){
      return $http.get(base_url_api+'feeds/'+feed_id);
    },
    my_feeds: function(){
      return $http.get(base_url_api+'users/me/feeds')
    },
    like: function(feed_id){
      return $http.put(base_url_api+'users/me/like', {feed_id: feed_id})
    },
    unlike: function(feed_id){
      return $http.put(base_url_api+'users/me/unlike', {feed_id: feed_id})
    },

  }
});