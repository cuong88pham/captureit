'use strict';
var base_url_api = 'http://localhost:3000/api/v1/';
myApp.factory('AuthFactory', function($window, $http){
  var auth = {
    isLogin: false,
    check: function(){
      if($window.localStorage.token && $window.localStorage.user){
        this.isLogin = true;
      }else{
        this.isLogin = false;
        $window.localStorage.clear();
        // $window.location.reload();
      }
    }
  }
  return auth;
});

