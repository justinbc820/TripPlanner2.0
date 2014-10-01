'use strict';

angular.module('tripPlannerApp')
  .controller('CalendarCtrl', function ($scope, planData) {
    this.eventSources = [];
    this.uiConfig = {
      calendar:{
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: this.alertEventOnClick,
        eventDrop: this.alertOnDrop,
        eventResize: this.alertOnResize
      }
    };
    this.showCalendar = function() {
      return planData.getCalendarStatus();
    }
  });
