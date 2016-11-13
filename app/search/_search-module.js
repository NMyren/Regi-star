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
  vm.subjects = [];

  vm.activeSubjects = {
    'CS': true,
    'MATH': true
  };

  CourseDataService.courses().then(function(data) {
    vm.courses = data;
  });

  CourseDataService.subjects().then(function(data) {
    vm.subjects = data;
  });

  vm.updateSubjects = function() {
    var updatedList = Object.keys(vm.activeSubjects).filter(function(key) {
      return vm.activeSubjects[key];
    });
    CourseDataService.updateSubjectsToFetch(updatedList);
    CourseDataService.courses().then(function(data) {
      vm.courses = data;
    });
  }
}

SearchService.$inject = [];
function SearchService() {
  return {};
}
