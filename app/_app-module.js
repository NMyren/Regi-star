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
  'ui.calendar'
]).config(['$httpProvider', function ($httpProvider) {
  // enable http caching
  $httpProvider.defaults.cache = true;
}]);
