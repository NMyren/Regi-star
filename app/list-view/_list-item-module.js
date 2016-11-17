'use strict';

angular.module('app.course-list-view', [])
  .component('listItem', {
    // bindings: {
    //   course: '<',
    //   crn: '@'
    // },
    templateUrl: 'list-view/course.html',
    controller: CourseController
  });

CourseController.$inject = [];

function CourseController($http) {
  var vm = this;
}
