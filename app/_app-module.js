'use strict';

angular.module('app', [
  'ngAnimate',
  'app.templates',
  'app.router',
  'app.calendar',
  'app.root',
  'app.search',
  'app.registration',
  'app.course-list-view',
  'ui.bootstrap',
  'ui.layout',
  'angular-cache',
  'ui.calendar'
]).config(['$httpProvider', function ($httpProvider) {
  // enable http caching
  $httpProvider.defaults.cache = true;
}]).run(['$http', 'CacheFactory', function($http, CacheFactory) {
  $http.defaults.cache = CacheFactory('http-cache', {
    maxAge: 15 * 60 * 1000,
    cacheFlushInterval: 60 * 60 * 1000,
    deleteOnExpire: 'aggressive',
    storageMode: 'localStorage'
  })
}]);
