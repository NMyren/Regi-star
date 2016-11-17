'use strict';

angular.module('app.calendar', [])
  .component('calendarView', {
    controllerAs: 'calendar',
    bindings: {
    },
    controller: CalendarViewController,
    templateUrl: 'calendar-view/calendar.html'
  });

CalendarViewController.$inject = ['$scope', 'uiCalendarConfig', 'CourseRegistrationService', '$window'];
function CalendarViewController($scope, uiCalendarConfig, CourseRegistrationService, $window) {

  var vm = this;

  vm.$onInit = function() {
    vm.courses = CourseRegistrationService.courses;
    /* CRN ADD*/
    vm.CRNInputs = [];
    vm.numCRNInput = 5;
    vm.dow = {'M': 1,'T': 2};
    vm.randomColors = [{
                        //'background': '#e97f7f',
                        'background': 'rgb(233,127,127)',
                        'backgroundT': 'rgba(233,127,127,0.5)',
                        'text': '#2a5547'
                       },
                       {
                        //'background': '#7e83e9',
                        'background': 'rgb(126,131,233)',
                        'backgroundT': 'rgba(126,131,233,0.5)',
                        'text': '#e0ffff'
                       },
                       {
                        'background': '#7ee982',
                        'text': '#40806a'
                       },
                       {
                        'background': '#e4d167',
                        'text': '#8859b6'
                       },
                       {
                        'background': '#67e47b',
                        'text': '#007a7c'
                       },
                       {
                        'background': '#8f67e4',
                        'text': '#c8f7c5'
                       }];

    initCalendar();
    setupCRNInputs();
    setupRenderHandler();
    renderCalendar();
  };

  // Calendar represents running weeks.
  // Display a generic week by displaying course times relative to zeroTime.
  function getZeroTime() {
    // time 0, add a day to get a Monday.
    return new moment(0).startOf('week').add(1, 'd');
  }

  function setupRenderHandler() {
    // Courses added or dropped. Re-render calendar
    CourseRegistrationService.subscribe($scope, renderCalendar);
  }

  function renderCalendar() {
    // map objects into displayable calendar events
    var events = [];
    for (var crn in vm.courses) {
      if (vm.courses.hasOwnProperty(crn)) {
        var course = vm.courses[crn];
        var transparent = course.preview;
        var colorPair = getRandomColorPair(transparent);
        events.push({
          'id': crn,
          'title': courseToString(crn, course),
          'start': getZeroTime().add(8, 'h'),
          'end': getZeroTime().add(9, 'h'),
          'dow': [1,3],
          'color': colorPair.background,
          'textColor': colorPair.text
        });
      }
    }

    // <div class="list-group-item-heading"><label>{{course.parents.subject.id}} {{course.parents.course.id}}</label> {{course.parents.course.label}} ({{crn}}) - {{course.creditHours}}</div>
    // <div><label>Section</label> {{course.meetings[0].type.code}} {{course.sectionNumber}}</div>
    // <div><label>Instructor</label> {{course.meetings[0].instructors[0].name}}</div>
    // <div><label>Meetings</label> {{course.meetings[0].daysOfTheWeek}} {{course.meetings[0].start}} - {{course.meetings[0].end}}</div>
    // <div><label>Location</label> {{course.meetings[0].buildingName}} {{course.meetings[0].roomNumber}}</div>

    // fullcalendar docs say this should be an array. On the contrary, only works as an object
    var eventSources = {
      'events': events,
      'className': 'calendar-event-content'
    };

    // dumb, necessary, unfortunate calendar hacks to re-render events
    angular.element('#calendar').fullCalendar('removeEvents');
    angular.element('#calendar').fullCalendar('addEventSource', eventSources);
    angular.element('#calendar').fullCalendar('rerenderEvents');
  }

  function courseToString(crn, course) {
    return [course.parents.subject.id,
            course.parents.course.id,
            course.parents.course.label,
            '(' + crn + ')'].join(' ');
  }

  function getRandomColorPair(transparent) {
    var rand = Math.floor(Math.random() * (vm.randomColors.length));
    console.log(rand);
    var bg = vm.randomColors[rand].background;
    if (transparent) {
      bg = vm.randomColors[rand].backgroundT;
    }
    return {'background': bg, 'text': vm.randomColors[rand].text};
  }

  function initCalendar() {
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
        'defaultDate': getZeroTime(),
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
        'header': false//,
        // 'eventClick': $scope.alertEventOnClick,
        // 'eventDrop': $scope.alertOnDrop,
        // 'eventResize': $scope.alertOnResize
        // 'events': vm.events
        }
    };
  }

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
