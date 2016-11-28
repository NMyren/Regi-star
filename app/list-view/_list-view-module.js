'use strict';

angular.module('app.course-list-view', [])
  .component('courseListView', {
    controllerAs: 'list',
    bindings: {
    },
    controller: ListViewController,
    templateUrl: 'list-view/list.html'
  });

ListViewController.$inject = ['CourseRegistrationService'];
function ListViewController(CourseRegistrationService) {
  var vm = this;
  vm.courses = CourseRegistrationService.courses;
  vm.deleteCourse = function(crn) {
    CourseRegistrationService.removeCourse(crn);
    CourseRegistrationService.notifyChange();
  };
}
