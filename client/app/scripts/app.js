'use strict';

var myApp = angular
  .module('captitApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'masonry'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/my_feeds', {
        templateUrl: 'views/main.html',
        controller: 'myFeedCtrl'
      })
      .when('/me', {
        templateUrl: 'views/profile.html',
        controller: 'profileCtrl'
      })
      .when('/feeds/:id', {
        templateUrl: 'views/feed.html',
        controller: 'FeedCtrl'
      })
      .when('/auth/sign_in', {
        templateUrl: 'views/auth/login.html',
        controller: 'AuthCtrl'
      })
      .when('/auth/sign_up', {
        templateUrl: 'views/auth/sign_up.html',
        controller: 'AuthCtrl'
      })
      .when('/auth/sign_out', {
        templateUrl: 'views/auth/login.html',
        controller: 'SignOutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

myApp.run(function($rootScope, $window, $location, $http, AuthFactory) {
  // when the page refreshes, check if the user is already logged in
  AuthFactory.check();
  $rootScope.isLogin = AuthFactory.isLogin;
  $http.defaults.headers.common.Authorization = $window.localStorage.token
});