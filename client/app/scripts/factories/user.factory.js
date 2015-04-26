'use strict';
var base_url_api = 'http://localhost:3000/api/v1/';
myApp.factory('UserFactory', function($window, $http, $location, AuthFactory){
  return {
    sign_in: function(email, password){
      return $http.post(base_url_api+'auth/sign_in', {email: email, password: password});
    },
    sign_out: function(){
      if(AuthFactory.isLogin){
        AuthFactory.isLogin = false;
        $window.localStorage.clear();
        $window.location.reload();
        $location.path("/");
      }
    },
    sign_up: function(user){
      return $http.post(base_url_api+'auth/sign_up', user);
    },
    me: function(){
      return $http.get(base_url_api+'users/me')
    }
  }
});