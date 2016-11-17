'use strict';

angular.module('app.calendar', [])
  .component('calendarView', {
    controllerAs: 'calendar',
    bindings: {
    },
    controller: CalendarViewController,
    templateUrl: 'calendar-view/calendar.html'
  });

CalendarViewController.$inject = ['$scope', 'uiCalendarConfig', 'CourseRegistrationService'];
function CalendarViewController($scope, uiCalendarConfig, CourseRegistrationService) {

  var vm = this;
  // time 0, add a day to get a Monday.
  vm.$onInit = function() {
    vm.zeroTime = new moment(0).endOf('week').add(1, 'd');
    vm.courses = CourseRegistrationService.courses;
    vm.coursesCopy = CourseRegistrationService.courses;
    /* CRN ADD*/
    vm.CRNInputs = [];
    vm.numCRNInput = 5;

    setupCRNInputs();
    setupRenderHandler();
    renderCalendar();
  };

  function setupRenderHandler() {
    // Courses added or dropped. Re-render calendar
    CourseRegistrationService.subscribe($scope, renderCalendar);
  }

  function renderCalendar() {
    console.log(vm.courses);
  }

  $scope.uiConfig = {
    'calendar': {
      'height': 'auto',
      //'contentHeight': 'auto',
      'editable': false,
      //'aspectRatio': 1,
      //'firstDay': 1, // Monday
      'weekends': false, // No weekend registration for now
      'defaultView': 'agendaWeek',
      'views': {
        'agendaWeek': {
          // EXTRA: these could be user config through a settings page.
          'allDayText': 'TBD',
          'minTime': '08:00:00',
          'maxTime': '19:00:00',
          'slotDuration': '00:15:00',
          //'slotDuration': '00:30:00',
          'slotLabelInterval': '01:00:00'//,
          //'slotEventOverlap': false,
          //'columnFormat': 'dddd'
        }
      },
      // use defaultDate unix:0 time, add courses based on 1st week unix:0 time
      'defaultDate': vm.zeroTime,
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

  function setupCRNInputs() {
    var i = 0;
    for (; i < vm.numCRNInput; i++) {
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
