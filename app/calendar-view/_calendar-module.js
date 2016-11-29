'use strict';

angular.module('app.calendar', [])
  .component('calendarView', {
    controllerAs: 'calendar',
    bindings: {},
    controller: CalendarViewController,
    templateUrl: 'calendar-view/calendar.html'
  });

CalendarViewController.$inject = ['$scope',
  'uiCalendarConfig',
  'CourseRegistrationService',
  '$timeout',
  'CourseDataService'];
function CalendarViewController($scope,
                                uiCalendarConfig,
                                CourseRegistrationService,
                                $timeout,
                                CourseDataService) {

  var vm = this;

  vm.$onInit = function () {
    vm.colors = {};
    vm.courses = CourseRegistrationService.courses;
    vm.prevCourses = CourseRegistrationService.courses;
    /* CRN ADD*/
    vm.CRNInputs = [];
    vm.numCRNInput = 5;
    vm.dow = {'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5};
    vm.timeFormat = ['h:mm A'];
    var bgA = 0.4;
    var textA = 0.65;
    vm.randomColors = [{
      'background': 'rgb(233,127,127)',
      'backgroundA': 'rgba(233,127,127,' + bgA + ')',
      'text': 'rgb(42,85,71)',
      'textA': 'rgba(42,85,71,' + textA + ')'
    },
      {
        'background': 'rgb(126,131,233)',
        'backgroundA': 'rgba(126,131,233,' + bgA + ')',
        'text': 'rgb(224,255,255)',
        'textA': 'rgba(224,255,255,' + textA + ')'
      },
      {
        'background': 'rgb(240,158,70)',
        'backgroundA': 'rgba(240,158,70,' + bgA + ')',
        'text': 'rgb(42,42,42)',
        'textA': 'rgba(42,42,42,' + textA + ')'
      },
      // {
      //  'background': 'rgb(228,209,103)',
      //  'backgroundA': 'rgba(228,209,103,' + bgA + ')',
      //  'text': 'rgb(136,89,182)',
      //  'textA': 'rgba(136,89,182,' + textA + ')'
      // },
      {
        'background': 'rgb(103,228,123)',
        'backgroundA': 'rgba(103,228,123,' + bgA + ')',
        'text': 'rgb(0,122,124)',
        'textA': 'rgba(0,122,124,' + textA + ')'
      },
      {
        'background': 'rgb(143,103,228)',
        'backgroundA': 'rgba(143,103,228,' + bgA + ')',
        'text': 'rgb(200,247,197)',
        'textA': 'rgba(200,247,197,' + textA + ')'
      }];

    vm.previewColor = {'background': 'rgba(228,209,103,' + bgA + ')', 'text': 'rgba(136,89,182,' + textA + ')'};

    initCalendar();
    setupCRNInputs();
    setupRenderHandler();
    renderCalendar();
  };

  $timeout(function() {
    CourseRegistrationService.notifyChange();
  }, 50);

  // Calendar represents running weeks.
  // Display a generic week by displaying course times relative to zeroTime.
  function getZeroTime() {
    // time 0, add a day to get a Monday.
    //noinspection JSPotentiallyInvalidConstructorUsage
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
      console.log(crn);
      if (vm.courses.hasOwnProperty(crn)) {
        console.log(crn);
        // TODO: fix duplicates/reloading concern
        var course = vm.courses[crn];
        console.log(course);
        var transparent = course.preview;
        console.log(course);
        var colorPair = getColorForCRN(crn, transparent);
        var allDay = false;
        var unalteredStart = moment(course.meetings[0].start, vm.timeFormat);
        var end = moment(course.meetings[0].end, vm.timeFormat);
        var start = unalteredStart.clone();
        // check if start is TBD -- TODO:: allDay not working for now
        if (course.meetings[0].start === 'ARRANGED') {
          allDay = true;
          start = getZeroTime();
        } else {
          start = getZeroTime().add(start.get('h'), 'h').add(start.get('m'), 'm');
        }
        var duration = end.diff(unalteredStart);
        var className = duration < moment.duration(1, 'hours') ? 'calendar-event-hour' : '';
        var dow = [1]; // TBD classes show on Monday
        if (!allDay) {
          dow = getDow(course.meetings[0].daysOfTheWeek);
        }

        events.push({
          'id': crn,
          'title': courseToString(crn, course),
          'start': start,
          'end': getZeroTime().add(end.get('h'), 'h').add(end.get('m'), 'm'),
          'dow': dow,
          'color': colorPair.background,
          'textColor': colorPair.text,
          'overlap': false,
          'className': className,
          'allDay': allDay
        });
      }
    }

    //  ({{crn}}) - {{course.creditHours}}</div>
    //  {{course.meetings[0].type.code}} {{course.sectionNumber}}</div>
    //  {{course.meetings[0].instructors[0].name}}</div>
    //  {{course.meetings[0].daysOfTheWeek}} {{course.meetings[0].start}} - {{course.meetings[0].end}}</div>
    //  {{course.meetings[0].buildingName}} {{course.meetings[0].roomNumber}}</div>

    // fullcalendar docs say this should be an array. On the contrary, only works as an object
    var eventSources = {
      'events': events,
      'className': 'calendar-event-content',
      'overlap': false
    };

    console.log(eventSources);

    // dumb, necessary, unfortunate calendar hacks to re-render events
    uiCalendarConfig.calendars.schedule.fullCalendar('option', 'height', $(window).height() - 150);
    uiCalendarConfig.calendars.schedule.fullCalendar('removeEvents');
    uiCalendarConfig.calendars.schedule.fullCalendar('addEventSource', eventSources);
    uiCalendarConfig.calendars.schedule.fullCalendar('rerenderEvents');
  }

  function courseToString(crn, course) {
    return [course.parents.subject.id,
      course.parents.course.id,
      course.parents.course.label,
      '(' + crn + ')'].join(' ');
  }

  function getColorForCRN(crn, transparent) {
    if (transparent) {
      return {
        bg: vm.previewColor.background,
        text: vm.previewColor.text
      };
    }

    if (!vm.colors[crn]) {
      vm.colors[crn] = getRandomColor();
    }

    return vm.colors[crn];
  }

  function getRandomColor() {
    var rand = Math.floor(Math.random() * (vm.randomColors.length));
    var bg = vm.randomColors[rand].background;
    var text = vm.randomColors[rand].text;
    return {
      bg: bg,
      text: text
    };
  }

  function getDow(weekdayLetters) {
    var dowArray = [];
    var i = 0;
    var len = weekdayLetters.length;
    for (; i < len; i++) {
      // vm.dow has weekday letters : numbers. Populate dowArray with numbers repre. days
      dowArray.push(vm.dow[weekdayLetters[i]]);
    }
    return dowArray;
  }

  function initCalendar() {
    $scope.uiConfig = {
      'calendar': {
        'height': 'auto',
        'editable': false,
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
            'slotLabelInterval': '01:00:00',
            'slotEventOverlap': false,
            'columnFormat': 'dddd'
          }
        },
        // use defaultDate unix:0 time, add courses based on 1st week unix:0 time
        'defaultDate': getZeroTime(),
        'header': false,
        'overlap': false
      }
    };
    $(window).resize(function() {
      uiCalendarConfig.calendars.schedule.fullCalendar('option', 'height', $(window).height() - 150);
      uiCalendarConfig.calendars.schedule.fullCalendar('render');
    });
  }

  function setupCRNInputs() {
    var i = 0;
    for (; i < vm.numCRNInput; i++) {
      var input = {'crn': ''};
      vm.CRNInputs.push(input);
    }
  }

  vm.registerByCRN = function () {
    var needsRender = false;
    vm.CRNInputs.forEach(function (userInput) {
      var crn = userInput.crn;
      userInput.crn = '';
      var section = CourseDataService.section(crn);
      // valid crn and not already registered -- check if preview
      if (section) {
        if (!vm.courses[crn] || (vm.courses[crn] && vm.courses[crn].preview)) {
          if (vm.courses[crn]) {
            vm.courses[crn].preview = !vm.courses[crn].preview; // must be currently previewed
          } else {
            section.preview = false;
            CourseRegistrationService.addCourse(section); // add from overall
          }

          needsRender = true;
        }
      }
    });

    if (needsRender) {
      CourseRegistrationService.notifyChange();
    }
  };

  vm.registerAllPreview = function () {
    for (var crn in vm.courses) {
      if (vm.courses.hasOwnProperty(crn)) {
        var preview = vm.courses[crn].preview;
        if (preview) {
          vm.courses[crn].preview = !preview;
        }
      }
    }
    CourseRegistrationService.notifyChange();
  };

}
