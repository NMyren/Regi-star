'use strict';

angular.module('app.course-list-view')
  .component('listItem', {
    bindings: {
      course: '<',
      crn: '<',
      deleteCourse: '&'
    },
    templateUrl: 'list-view/course.html'
  });
