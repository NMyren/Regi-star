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
    'calendar': {
      'height': 'auto',
      'editable': false,
      //'aspectRatio': 0.5,
      'firstDay': 1, // Monday
      'weekends': false, // No weekend registration for now
      'defaultView': 'agendaWeek',
      'views': {
        'agendaWeek': {
          // EXTRA: these could be user config through a settings page.
          'allDayText': 'TBD',
          'minTime': '08:00:00',
          'maxTime': '19:00:00',
          'slotDuration': '00:15:00',
          'slotLabelInterval': '01:00:00',
          //'slotEventOverlap': false,
          'columnFormat': 'dddd'
        }
      },
      // use defaultDate unix:0 time, add courses based on 1st week unix:0 time
      //'defaultDate': new moment(),
      // 'customButtons': {
      //   'registerAllPreview': {
      //     'text': 'Register Previewed Courses',
      //     'click': function() {
      //       //TODO: Registration
      //     }
      //   }
      // },
      // 'header': {
      //   'left': '', // default is 'title'
      //   'right': 'registerAllPreview'
      // },
      'header': false,
      'eventClick': $scope.alertEventOnClick,
      'eventDrop': $scope.alertOnDrop,
      'eventResize': $scope.alertOnResize
      }
  };

  $scope.eventSources = [];

  vm.myCalendar = uiCalendarConfig.calendars.myCalendar;
  vm.uiCalendarConfig = uiCalendarConfig;

  /* CRN ADD*/
  vm.CRNInputs = [];
  var numCRNInput = 5;

  setupCRNInputs();
  function setupCRNInputs() {
    var i = 0;
    for (; i < numCRNInput; i++) {
      var input = {'CRN': ''};
      vm.CRNInputs.push(input);
    }
  }

  vm.registerByCRN = function() {
    //TODO: Registration
  };

  vm.registerAllPreview = function() {
    //TODO: Registration
  };

}
