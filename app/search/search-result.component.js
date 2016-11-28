'use strict';

angular.module('app.search')
  .component('courseSearchResult', {
    templateUrl: 'search/result.html',
    bindings: {
      course: '<',
      updateSelection: '&',
      selections: '='
    },
    controller: ResultController
  });

ResultController.$inject = ['$http'];

function ResultController($http) {
  var vm = this
  vm.sections = {};

  vm.$onInit = function() {
    vm.selectedSections = vm.selections;
    vm.course.sections.forEach(function(section) {
      $http.get(section.href)
        .then(function(response) {
          vm.sections[section.id] = response.data;
        });
    });
  };

  vm.select = function (section, $event) {
    // vm.selectedSections[section.id] = !vm.selectedSections[section.id];
    vm.updateSelection({section: section});
  };
}
