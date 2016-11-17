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
  vm.loadingInfo = true;

  function toggleLoading() {
    vm.loadingInfo = !vm.loadingInfo;
  }

  vm.selectedSections = {};

  vm.activeSubjects = {
    'CS': true,
    'MATH': true
  };

  CourseDataService.courses().then(function (data) {
    toggleLoading();
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
    CourseRegistrationService.addCourses(Object.values(vm.selectedSections).map(function (section) {
      section.preview = false;
      return section;
    }));
    CourseRegistrationService.notifyChange();
  };

  vm.preview = function () {
    CourseRegistrationService.addCourses(Object.values(vm.selectedSections).map(function (section) {
      section.preview = true;
      return section;
    }));
    CourseRegistrationService.notifyChange();
  };

  vm.updateSubjects = function () {
    var updatedList = Object.keys(vm.activeSubjects).filter(function (key) {
      return vm.activeSubjects[key];
    });

    CourseDataService.updateSubjectsToFetch(updatedList);
    // these toggles aren't in the right place. Can't really be done for waiting for ng-repeat filter to finish
    toggleLoading();
    CourseDataService.courses().then(function (data) {
      toggleLoading();
      vm.courses = data;
    });
  };
}

SearchService.$inject = [];
function SearchService() {
  return {};
}
