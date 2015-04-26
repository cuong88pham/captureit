myApp.controller('FeedCtrl', ['$scope', '$sce','$window', '$routeParams', 'FeedFactory', function($scope, $sce, $window, $routeParams, FeedFactory){
  $scope.feed = {};
  $scope.user_id = $window.localStorage.user;
  FeedFactory.find_by_id($routeParams.id)
  .success(function(feed){
    $scope.feed = feed;
    $scope.url = $sce.trustAsResourceUrl(feed.url);
  })
  .error(function(err){

  });

  $scope.like = function(feed_id){
    var user = $window.localStorage.user;
    if(user){
      FeedFactory.like(feed_id).success(function(data){
        console.log(data);
      })
      .error(function(err){

      });
    }else{
      alert('Please login to like it!');
      return false;
    }
  }

  $scope.unlike = function(feed_id){
    var user = $window.localStorage.user;

    if(user){
      FeedFactory.unlike(feed_id).success(function(data){
        console.log(data);
        $scope.disable_heart = 'disable_heart';
      })
      .error(function(err){

      });
    }else{
      alert('Please login to like it!');
      return false;
    }
  }

  $scope.iframeOnLoad = function(){
    var iframe = document.getElementById('iframe');
    if(iframe){
      iframe.height = "";
      iframe.height = "500px";
    }
  }
}]).controller('myFeedCtrl', ['$scope', 'FeedFactory', 'UserFactory', function($scope, FeedFactory, UserFactory){
  $scope.feeds = {};
  FeedFactory.my_feeds().success(function(feeds){
    $scope.feeds = feeds;
  })
  .error(function(err){
    console.log(err);
  })
}]);