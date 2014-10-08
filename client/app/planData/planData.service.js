'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function ($http, $rootScope) {
    var currentTrip = {
      location: {
        latitude:37.775,
        longitude:-122.419
      }
    };

    var trip = {};

    var currentSearch = {searchResults:[]};

    // Public API here
    return {
      setCurrentTrip: function(trip) {
        currentTrip = trip;
        currentTrip.location = {
          latitude:37.775,
          longitude:-122.419
        };
        $rootScope.$broadcast('newCurrentTrip');
      },

      getCurrentTrip: function() {
        return currentTrip;
      },

      setTrip: function(id) {
        trip.tripId = id;
      },

      getTrip: function() {
        return trip.tripId;
      },

      addToTrip: function(obj) {
        var tripId = currentTrip._id;

        $http.put('/api/trips/wishlist/' + tripId, obj)
        .success(function(trip) {
          console.log("new trip from DB ", trip);
        })
      },

      setInitialTrip: function(trip) {
        trip.initialTrip = trip;
      },

      getInitialTrip: function() {
        return trip.initialTrip;
      },

      setSearchResults: function(data) {
        currentSearch.searchResults.length=0;
        currentSearch.searchResults = data;
      },

      getSearchResults: function() {
        return currentSearch.searchResults;
      }
    };
  });
