'use strict';

angular.module('app.search', [])
  .factory('SearchService', SearchService)
  .component('mainSearchView', {
    controllerAs: 'search',
    bindToController: {

    },
    templateUrl: 'search/search.html'
  });

SearchService.$inject = [];

function SearchService() {
  return {};
}
