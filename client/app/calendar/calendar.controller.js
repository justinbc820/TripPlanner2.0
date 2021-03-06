'use strict';

angular.module('tripPlannerApp')
  .controller('CalendarCtrl', function($scope, planData, $http, $stateParams, $rootScope) {
    // set the current trip and the populate events array
    var tripId = $stateParams.id;
    $scope.currentTrip = planData.getCurrentTrip();
    $scope.events = [];

    /* event sources array*/
    $scope.eventSources = [];

    this.init = function() {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        planData.setCurrentTrip(trip);
        $scope.currentTrip = planData.getCurrentTrip();
        $scope.events = $scope.currentTrip.activities;
      });
    }

    if(!planData.getCurrentTrip()) {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        planData.setCurrentTrip(trip);
        $scope.calendar.fullCalendar('refetchEvents');
      });
    };

    $scope.$watch('calendar', function(newval, oldval) {
      if (newval) {
        $scope.calendar = newval;
        $scope.calendar.fullCalendar('render');
      }
    })

    $scope.$on('newCurrentTrip', function() {
      $scope.currentTrip = planData.getCurrentTrip();
      $scope.events = $scope.currentTrip.activities;
      $scope.eventSources[0] = $scope.events.map(function(event) {
        var startDate = new Date(event.start);
        var start = event.start;
        var end;
        if(event.end) {
          end = event.end
        } else {
          var temp = new Date(startDate.setHours(startDate.getHours() + 1)).adjustDST();
          end = new Date(temp).toUTCString();
        }

        return {
          title: event.title,
          googleDetails:event.googleDetails,
          start: start,
          end: end,
          allDay: false,
          id: event.googleDetails.place_id,
          token: Math.floor(Math.random()*Math.random()*Math.random()*1000000)
        };
      });
      $scope.calendar.fullCalendar('refetchEvents');
    });

    ////////////////////////////////////////////////////////////////////
    // SETUP DEFAULT DATE PROPERTIES FOR THE controller
    ////////////////////////////////////////////////////////////////////

    // Check to see if it's currently Daylight Savings Time
    var today = new Date();
    var dst = false;

    // This function on the prototype calculates the time offset as if we were in Jan and as if we were in July
    // Then, it returns whichever one is greater. If neither is greater than that place doesn't have DST.
    Date.prototype.stdTimezoneOffset = function() {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    // This function compares the greater time offset (either Jan or Jul offset) to the current offset
    // if the current timezone offset from today is less than the greater timezone offset of Jan or Jul,
    // then we are on DST
    Date.prototype.dst = function() {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }

    if (today.dst()) {
      var dst = true;
    }

    // This function is called on date objects and will subtract one hour if DST is true.
    // If it's not true, it'll just return the date object
    Date.prototype.adjustDST = function() {
      if(dst) {
        return new Date(this.setHours(this.getHours() - 1));
      } else {
        return this;
      }
    }

    ////////////////////////////////////////////////////////////////////
    // END DATE SETUP
    ////////////////////////////////////////////////////////////////////

    $scope.updateActivityDetails = function(event) {
      for(var i=0, n=$scope.eventSources[0].length; i<n; i++) {
        if($scope.eventSources[0][i].token == event.token) {

          var start = new Date($scope.events[i].start);
          $scope.events[i].start = event.start.toUTCString();

          if(event.end) {
            $scope.events[i].end = event.end.toUTCString();
          } else {
            var end = new Date(event.start.setHours(event.start.getHours() + 1));
            $scope.events[i].end = new Date(end).toUTCString();
          }
        }
      }

      $http.post('/api/trips/' + tripId, {
        activities: $scope.events
      }).success(function(updatedTrip) {
        planData.setCurrentTrip(updatedTrip);
      })
    }

    $rootScope.$on('deleteActivity', function(event, token) {
      $scope.deleteActivity(token);
    })

    $scope.deleteActivity = function(token) {
      for(var i = 0; i < $scope.eventSources[0].length; i++) {
        if(token === $scope.eventSources[0][i].token) {
          $scope.events.splice(i, 1);
          $scope.currentEvent = null;
          break;
        }
      }
      $http.post('/api/trips/' + tripId, {
        activities: $scope.events
      }).success(function(updatedTrip) {
        planData.setCurrentTrip(updatedTrip);
      })
    }

    //with this you can handle the events that generated by clicking the day(empty spot) in the calendar
    $scope.dayClick = function(date, allDay) {
      $scope.$apply(function() {
        console.log('Day Clicked ' + date);
      });
    };

    //with this you can handle the events that generated by dropping any event to different position in the calendar
    $scope.alertOnDrop = function(event) {
      $scope.$apply(function() {
        $scope.updateActivityDetails(event);
      });
    };


    //with this you can handle the events that generated by resizing any event to different position in the calendar
    $scope.alertOnResize = function(event) {
      $scope.$apply(function() {
        $scope.updateActivityDetails(event);
      });
    };

    $scope.deletePanel = false;
    $scope.currentEvent = null;

    //with this you can handle the click on the events
    $scope.eventClick = function(event, allDay, jsEvent, view) {
      $scope.$apply(function() {
        console.log("From before tripEdit", event.token);
        planData.setActivityDetails(event);
        $scope.currentEvent = event;
        // $scope.deletePanel = !$scope.deletePanel;
      });
    };

    /* config object */
    $scope.uiConfig = {
      calendar: {
        // height:'auto',
        editable: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.dayClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventClick: $scope.eventClick,
        viewRender: $scope.renderView,
        timezone:'UTC'
      }
    };

    this.init();
  });