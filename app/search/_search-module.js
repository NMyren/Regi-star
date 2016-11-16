'use strict';

angular.module('app.search', [])
  .factory('SearchService', SearchService)
  .component('mainSearchView', {
    controllerAs: 'search',
    bindings: {},
    controller: SearchViewController,
    templateUrl: 'search/search.html'
  });

SearchViewController.$inject = ['CourseDataService', 'CourseRegistrationService'];
function SearchViewController(CourseDataService, CourseRegistrationService) {
  var vm = this;
  vm.terms = '';
  vm.courses = [];
  vm.subjects = [];

  vm.selectedSections = {};

  vm.activeSubjects = {
    'CS': true,
    'MATH': true
  };

  CourseDataService.courses().then(function (data) {
    vm.courses = data;
    console.log(vm.courses);
  });

  CourseDataService.subjects().then(function (data) {
    vm.subjects = data;
  });

  vm.updateSelection = function (section) {
    if (vm.selectedSections[section.id]) {
      delete vm.selectedSections[section.id];
    } else {
      vm.selectedSections[section.id] = section;
    }
  };

  vm.register = function () {
    CourseRegistrationService.addCourses(Object.values(vm.selectedSections));
  };

  vm.updateSubjects = function () {
    var updatedList = Object.keys(vm.activeSubjects).filter(function (key) {
      return vm.activeSubjects[key];
    });

    CourseDataService.updateSubjectsToFetch(updatedList);
    CourseDataService.courses().then(function (data) {
      vm.courses = data;
    });
  };
}

SearchService.$inject = [];
function SearchService() {
  return {};
}
