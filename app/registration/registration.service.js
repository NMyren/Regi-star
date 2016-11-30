'use strict';

angular.module('app.registration')
.factory('CourseRegistrationService', CourseRegistrationService);

CourseRegistrationService.$inject = ['$rootScope', 'CacheFactory'];
function CourseRegistrationService($rootScope, CacheFactory) {
  var key = 'courses';
  var cache = new CacheFactory('course-cache', {
    storageMode: 'localStorage'
  });
  var courses = cache.get(key) || {};

  console.log(cache.info());
  function addCourse(section) {
    courses[section.id] = section;
    cache.put(key, courses);
    console.log(cache.info());
  }

  function removeCourse(crn) {
    delete courses[crn];
    cache.put(key, courses);
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
