'use strict';

angular.module('app.course-list-view', [])
  .component('courseListView', {
    controllerAs: 'list',
    bindings: {

    },
    controller: ListViewController,
    templateUrl: 'list-view/list.html'
  });

ListViewController.$inject = ['CourseRegistrationService', '$scope'];
function ListViewController(CourseRegistrationService, $scope) {
  var vm = this;
  vm.courses = CourseRegistrationService.courses;
  // TODO: filter courses into registered and preview
  // vm.registeredCourses
  // vm.previewCourses

  // Watch? I think if new courses are added/removed, vm.courses wouldn't change -- not binded
  $scope.$watch('CourseRegistrationService.courses', function(oldVal, newVal) {
    vm.courses = newVal;
  });
}
