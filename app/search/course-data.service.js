'use strict';

angular.module('app.search')
  .factory('CourseDataService', CourseDataService);

CourseDataService.$inject = ['$http', '$q'];
function CourseDataService($http, $q) {
  var semester = {};
  var subjectsToFetch = ['CS', 'MATH'];

  var subjects = {};
  var courses = {};
  var coursePromise = $q.defer();

  $http.get('/2017/spring.json')
    .then(function (spring) {
      angular.extend(semester, spring.data);
      console.log(semester);
      fetchSubjectCourseInfo();
    });

  return {
    subjects: function () {
      return semester.subjects;
    },
    courses: function() {
      return coursePromise.promise.then(function() {
        return Object.values(courses);
      });
    },
    updateSubjectsToFetch: function (toFetch) {
      subjectsToFetch = toFetch;
      fetchSubjectCourseInfo();
    }
  };

  function fetchSubjectCourseInfo() {
    semester.subjects
      .filter(function (sub) {
        return subjectsToFetch.indexOf(sub.id) !== -1;
      })
      .forEach(function(subject) {
        $http.get(subject.href)
          .then(function(subject) {
            subjects[subject.data.id] = subject.data;

            $q.all(subject.data.courses.map(function(course) {
               return $http.get(course.href)
                 .then(function(courseInfo) {
                   courses[courseInfo.data.id] = courseInfo.data;
                 });
            })).then(function() {
              coursePromise.resolve();
            });
          });
      });

  }
}
