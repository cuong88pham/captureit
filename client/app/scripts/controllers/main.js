'use strict';

myApp.controller('MainCtrl', ['$scope', '$window', 'FeedFactory', 'AuthFactory', function ($scope, $window, FeedFactory, AuthFactory){

  $scope.feeds = {};
  $scope.isLogin = AuthFactory.isLogin;
  FeedFactory.getAll()
  .success(function(feeds){
    $scope.feeds = feeds;
  })
  .error(function(err){
    console.log(err);
  });
}]);
