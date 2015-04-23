'use strict';

myApp.controller('MainCtrl', function ($scope, FeedFactory){

  $scope.feeds = {};
  FeedFactory.getAll()
  .success(function(feeds){
    $scope.feeds = feeds;
  })
  .error(function(err){

  });
});
