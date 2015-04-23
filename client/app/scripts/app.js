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
      .when('/feeds/:id', {
        templateUrl: 'views/feed.html',
        controller: 'FeedCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
