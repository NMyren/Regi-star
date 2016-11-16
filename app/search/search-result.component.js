'use strict';

angular.module('app.search')
  .component('courseSearchResult', {
    templateUrl: 'search/result.html',
    bindings: {
      course: '<',
      updateSelection: '&'
    },
    controller: function () {
      var vm = this;
      vm.selectedSections = {};

      vm.select = function (section, $event) {
        if ($event !== undefined) {
          $event.stopPropagation();
        }
        vm.selectedSections[section.id] = !vm.selectedSections[section.id];
        vm.updateSelection({section: section});
      };
    }
  });
