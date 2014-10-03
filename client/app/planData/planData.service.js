'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function () {
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

    var trip = {};

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

      setTrip: function(id) {
        trip.tripId = id;
        console.log(trip.tripId);
      },

      getTrip: function() {
        return trip.tripId;
      },

      setInitialTrip: function(trip) {
        trip.initialTrip = trip;
        console.log("initial trip set", trip.initialTrip);
      },

      getInitialTrip: function() {
        return trip.initialTrip;
      }
    };
  });
