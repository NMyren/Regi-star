'use strict';

angular.module('app.course-list-view')
  .component('listItem', {
    bindings: {
      course: '<',
      crn: '<'
    },
    templateUrl: 'list-view/course.html'
  });
