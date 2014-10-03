'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function ($rootScope) {
    var mapCalendarViews = {
      map: true,
      calendar: true
    };

    var currentTrip = {
      location: {
        latitude:37.775,
        longitude:-122.419
      }
    };

    var textSearch = {};
    var radarSearch = {};

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
      },

      getCurrentTrip: function() {
        return currentTrip;
      },

      setTextSearch: function(data) {
        textSearch.results = data;
        console.log(textSearch.results);
      },

      getTextSearch: function() {
        return textSearch.results;
      },

      setRadarSearch: function(data) {
        radarSearch.results = data;
        $rootScope.$broadcast('radarSearch');
      },

      getRadarSearch: function() {
        return radarSearch.results;
      }
    };
  });
