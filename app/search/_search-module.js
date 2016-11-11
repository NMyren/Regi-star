'use strict';

angular.module('app.search', [])
  .factory('SearchService', SearchService)
  .component('mainSearchView', {
    controllerAs: 'search',
    bindings: {

    },
    controller: SearchViewController,
    templateUrl: 'search/search.html'
  });

SearchViewController.$inject = ['CourseDataService'];
function SearchViewController(CourseDataService) {
  this.terms = '';
  this.courses = ['test course', 'another course', 'science', 'user interface design', 'cs 465'];
}

SearchService.$inject = [];
function SearchService() {
  return {};
}
