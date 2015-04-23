'use strict';
var base_url_api = 'http://localhost:3000/api/v1/';
myApp.factory('FeedFactory', function($window, $http){
  return {
    getAll: function(){
      return $http.get(base_url_api+'feeds')
    },
    find_by_id: function(feed_id){
      return $http.get(base_url_api+'feeds/'+feed_id);
    }
  }
});