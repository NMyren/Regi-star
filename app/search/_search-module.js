'use strict';

angular.module('app.search', [])
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

  vm.selectedSectionData = {};
  vm.sectionSelections = {};

  vm.activeSubjects = {
    'CS': true,
    'MATH': true
  };

  CourseDataService.courses().then(function (data) {
    toggleLoading();
    vm.courses = data;
  });

  CourseDataService.subjects().then(function (data) {
    vm.subjects = data;
  });

  vm.updateSelection = function (section) {
    if (vm.selectedSectionData[section.id]) {
      delete vm.selectedSectionData[section.id];
      vm.sectionSelections[section.id] = false;
    } else {
      vm.selectedSectionData[section.id] = section;
      vm.sectionSelections[section.id] = true;
    }
  };

  function clearSelections() {
    Object.keys(vm.sectionSelections).forEach(function(crn) {
      delete vm.selectedSectionData[crn];
      vm.sectionSelections[crn] = false;
    });
  }

  vm.register = function () {
    CourseRegistrationService.addCourses(Object.values(vm.selectedSectionData).map(function (section) {
      section.preview = false;
      return section;
    }));
    CourseRegistrationService.notifyChange();
    clearSelections();
  };

  vm.preview = function () {
    CourseRegistrationService.addCourses(Object.values(vm.selectedSectionData).map(function (section) {
      section.preview = true;
      return section;
    }));
    CourseRegistrationService.notifyChange();
    clearSelections();
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
