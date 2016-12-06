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
  var vm = this;
  vm.sections = {};

  var closed = '#DF2F32'; // red, alert, course is full
  var closing = '#FFCC33'; // yellow, warning, course is filling up
  var ok = '#87ff2a'; // green, ok, course has room
  var capacityIndicator = [closed,
                           closing,
                           closing,
                           ok,
                           ok,
                           ok,
                           ok,
                           ok,
                           ok,
                           ok];
  // randomize
  capacityIndicator.forEach(function(color, index) {
    var randomIndex = Math.floor(Math.random() * capacityIndicator.length);
    capacityIndicator[index] = capacityIndicator[randomIndex]; // swap
    capacityIndicator[randomIndex] = color;
  });

  vm.$onInit = function () {
    vm.selectedSections = vm.selections;
    vm.course.sections.forEach(function (section) {
      $http.get(section.href)
        .then(function (response) {
          vm.sections[section.id] = response.data;

          // assign random capacity color
          var randomIndex = Math.floor(Math.random() * capacityIndicator.length);
          vm.sections[section.id].capacityColor = capacityIndicator[randomIndex];
        });
    });
  };

  vm.select = function (section, $event) {
    if ($event) {
      $event.stopPropagation();
    }
    vm.selectedSections[section.id] = !vm.selectedSections[section.id];
    vm.updateSelection({section: section});
  };
}
