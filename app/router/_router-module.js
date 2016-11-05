'use strict';

angular.module('app.router', ['ui.router'])
.config(Config);

Config.$inject = ['$stateProvider', '$urlRouterProvider'];

function Config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: 'root/root.html'
    });
}
