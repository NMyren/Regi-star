'use strict';

angular.module('app.search')
  .factory('CourseDataService', CourseDataService);

var subjects = ['CS', 'MATH', 'GEOG'];

CourseDataService.$inject = ['$http'];
function CourseDataService($http) {
  $http.get('/2017/spring.json')
    .then(function(spring) {
      spring.data.subjects.forEach(function(subject) {
        if (subjects.indexOf(subject.id) !== -1) {
          $http.get(subject.href)
            .then(function(sub) {
              sub.data.courses.forEach(function(course) {
                $http.get(course.href)
                  .then(function(c) {
                    c.data.sections.forEach(function(section) {
                      $http.get(section.href)
                        .then(function(sec) {
                        });
                    });
                  });
              });
            });
        }
      });
    });

  return {};
}
