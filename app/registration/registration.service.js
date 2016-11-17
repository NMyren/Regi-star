'use strict';

angular.module('app.registration')
.factory('CourseRegistrationService', CourseRegistrationService);

CourseRegistrationService.$inject = ['$rootScope'];
function CourseRegistrationService($rootScope) {
  var courses = {};

  function addCourse(section) {
    courses[section.id] = section;
  }

  function removeCourse(crn) {
    delete courses[crn];
  }

  return {
    courses: courses,
    addCourse: addCourse,
    addCourses: function(courses) {
      courses.forEach(addCourse);
    },
    removeCourse: removeCourse,
    removeCourses: function(courses) {
      courses.forEach(removeCourse);
    },

    'subscribe': function(scope, callback/*, eventName*/) {
      var handler = $rootScope.$on('change',/*eventName,*/ callback);
      scope.$on('$destroy', handler);
    },

    'notifyChange': function() {
      $rootScope.$emit('change');
    }
  };
}
