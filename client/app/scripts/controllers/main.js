'use strict';

myApp.controller('MainCtrl', function ($scope, $window, FeedFactory, AuthFactory){

  $scope.feeds = {};
  $scope.isLogin = AuthFactory.isLogin;
  FeedFactory.getAll()
  .success(function(feeds){
    $scope.feeds = feeds;
  })
  .error(function(err){

  });
});
