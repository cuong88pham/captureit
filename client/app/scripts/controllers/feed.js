myApp.controller('FeedCtrl', function ($scope, $sce, $routeParams, FeedFactory){

  $scope.feed = {};
  FeedFactory.find_by_id($routeParams.id)
  .success(function(feed){
    $scope.feed = feed;
    $scope.url = $sce.trustAsResourceUrl(feed.url);
  })
  .error(function(err){

  });
  $scope.iframeOnLoad = function(){
    var iframe = document.getElementById('iframe');
    if(iframe){
      iframe.height = "";
      iframe.height = "500px";
    }
  }
});