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
  var vm = this;
  vm.terms = '';
  vm.courses = [];

  CourseDataService.courses().then(function(data) {
    vm.courses = data;
  });
  console.log(vm.courses);
}

SearchService.$inject = [];
function SearchService() {
  return {};
}
