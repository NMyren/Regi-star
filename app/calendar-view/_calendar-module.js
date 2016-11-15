'use strict';

angular.module('app.calendar', [])
  .component('calendarView', {
    controllerAs: 'calendar',
    bindings: {
    },
    controller: CalendarViewController,
    templateUrl: 'calendar-view/calendar.html'
  });

CalendarViewController.$inject = ['$scope', 'uiCalendarConfig'];
function CalendarViewController($scope, uiCalendarConfig) {
  var vm = this;
  $scope.uiConfig = {
    calendar: {
    height: 450,
      editable: true,
    header: {
      left: 'month basicWeek basicDay agendaWeek agendaDay',
      center: 'title',
      right: 'today prev,next'
    },
    eventClick: $scope.alertEventOnClick,
    eventDrop: $scope.alertOnDrop,
    eventResize: $scope.alertOnResize
    }
  };

  $scope.eventSources = [];

  vm.myCalendar = uiCalendarConfig.calendars.myCalendar;
  vm.uiCalendarConfig = uiCalendarConfig;
}
