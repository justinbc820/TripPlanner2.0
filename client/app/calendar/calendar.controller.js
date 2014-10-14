'use strict';

angular.module('tripPlannerApp')
  .controller('CalendarCtrl', function ($scope, planData, $http, $stateParams) {

    this.init = function() {
      updatePlanData();
    };


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    this.changeTo = 'Hungarian';

    // set the current trip and the populate events array
    var tripId = $stateParams.id;
    $scope.currentTrip = planData.getCurrentTrip();
    this.events = [];
    var self = this;

    var updatePlanData = function() {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        planData.setCurrentTrip(trip);
        $scope.currentTrip = planData.getCurrentTrip();
        self.events = $scope.currentTrip.activities;
        self.eventSources[0] = self.events.map(function(event) {
          return {title: event.title, start: new Date(event.start)};
        });
      });
    };

    if(!planData.getCurrentTrip()) {
      updatePlanData();
    }

    $scope.$on('addToCal', function() {
      updatePlanData();
    });


    /* event source that calls a function on every view switch */
    this.eventsF = function (start, end, callback) {
      // debugger;
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    this.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
      ]
    };
    /* alert on eventClick */
    this.alertOnEventClick = function( event, allDay, jsEvent, view ){
      this.alertMessage = (event.title + ' was clicked ');
      console.log(this.alertMessage);
    };
    /* alert on Drop */
    this.alertOnDrop = function( event, revertFunc, jsEvent, ui, view){
     this.alertMessage = ('Event Droped on ' + event.start);
     console.log(this.alertMessage);
    };
    /* alert on Resize */
    this.alertOnResize = function( event, jsEvent, ui, view){
     this.alertMessage = ('Event end date was moved to ' + event.end.format());
     console.log(this.alertMessage);
    };
    /* add and removes an event source of choice */
    this.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };

    /* add custom event*/
    // this.addEvent = function() {
    //   this.events.push({
    //     title: 'Open Sesame',
    //     start: new Date(y, m, 28),
    //     end: new Date(y, m, 29),
    //     className: ['openSesame']
    //   });
    // };

    /* remove event */
    this.remove = function(index) {
      this.events.splice(index,1);
    };

    /* Change View */
    this.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
    };

    /* Change View */
    this.renderCalender = function(calendar) {
      if(calendar){
        calendar.fullCalendar('render');
      }
    };

    this.changeLang = function() {
      if(this.changeTo === 'Hungarian'){
        this.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        this.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        this.changeTo= 'English';
      } else {
        this.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.changeTo = 'Hungarian';
      }
    };

    /* event sources array*/
    this.eventSources = [this.events];
    this.eventSources2 = [this.calEventsExt, this.eventsF, this.events];

    this.uiConfig = {
      calendar:{
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: this.alertOnEventClick,
        eventDrop: this.alertOnDrop,
        eventResize: this.alertOnResize
      }
    };

    this.init();

  });
