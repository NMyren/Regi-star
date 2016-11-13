'use strict';

angular.module('app.search')
  .component('courseSearchResult', {
    templateUrl: 'search/result.html',
    bindings: {
      course: '<'
    }
  });
