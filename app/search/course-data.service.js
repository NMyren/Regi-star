'use strict';

angular.module('app.search')
  .factory('CourseDataService', CourseDataService);

CourseDataService.$inject = ['$http', '$q', 'CacheFactory'];
function CourseDataService($http, $q, CacheFactory) {
  var semester = {};
  var cache = new CacheFactory('data-cache', {
    storageMode: 'localStorage'
  });
  var key = 'loaded-subjects';
  var subjectsToFetch = cache.get(key) || ['CS', 'MATH'];

  var subjects = {};
  var subjectPromise = $q.defer();

  var courses = {};
  var coursePromise = $q.defer();

  var sections = {};

  $http.get('/2017/spring.json')
    .then(function (spring) {
      angular.extend(semester, spring.data);
      fetchSubjectCourseInfo();
      subjectPromise.resolve(semester);
    });

  return {
    subjects: function () {
      return subjectPromise.promise.then(function (sem) {
        return sem.subjects;
      });
    },
    courses: function () {
      return coursePromise.promise.then(function () {
        return Object.values(courses);
      });
    },
    section: function(crn) {
      return sections[crn];
    },
    activeSubjects: subjectsToFetch,
    updateSubjectsToFetch: function (toFetch) {
      coursePromise = $q.defer();
      subjectsToFetch = toFetch;
      cache.put(key, toFetch);
      console.log(subjectsToFetch);
      fetchSubjectCourseInfo();
    }
  };

  function fetchSubjectCourseInfo() {
    courses = {};
    $q.all(semester.subjects
      .filter(function (sub) {
        return subjectsToFetch.indexOf(sub.id) !== -1;
      })
      .map(function (subject) {
        return $http.get(subject.href)
          .then(function (subject) {
            subjects[subject.data.id] = subject.data;

            return $q.all(subject.data.courses.map(function (course) {
              return $http.get(course.href)
                .then(function (courseInfo) {
                  courses[courseInfo.data.id] = courseInfo.data;
                  courseInfo.data.sections.forEach(function (section) {
                    $http.get(section.href).then(function (response) {
                      sections[section.id] = response.data;
                      sections[section.id].creditHours = sections[section.id].creditHours || courses[courseInfo.data.id].creditHours;
                    });
                  });
                });
            }));
          });
      }))
      .then(function () {
        coursePromise.resolve();
      });

  }
}
