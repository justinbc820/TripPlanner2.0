'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function () {
    var mapCalendarViews = {
      map: true,
      calendar: true
    }

    // Public API here
    return {
      toggleView: function(view) {
        if(view == 'map') {
          mapCalendarViews.map = true;
          mapCalendarViews.calendar = false;
        }
        if(view == 'calendar') {
          mapCalendarViews.map = false;
          mapCalendarViews.calendar = true;
        }
      },
      getMapStatus: function() {
        return mapCalendarViews.map;
      },
      getCalendarStatus: function() {
        return mapCalendarViews.calendar;
      }
    };
  });
