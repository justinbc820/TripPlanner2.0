'use strict';

angular.module('tripPlannerApp')
  .controller('PlanCtrl', function () {
    this.map = {
      center: {
          latitude: 45,
          longitude: -73
      },
      zoom: 8
    };
    this.radioModel = 'map';
    this.eventSources = [];
    this.uiConfig = {
      calendar:{
        // height: 800,
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
  });
