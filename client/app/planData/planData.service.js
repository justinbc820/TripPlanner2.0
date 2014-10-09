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

    var recommendations = {};

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

        var name = obj.name;
        var address = obj.formatted_address;
        var latitude = obj.geometry.location.k;
        var longitude = obj.geometry.location.B;
        var cost = obj.price_level || 9; // 9 means undefined price
        $http.put('/api/trips/wishlist/' + tripId, {
          name:name,
          address:address,
          latitude:latitude,
          longitude:longitude,
          cost:cost
        }).success(function(trip) {
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
      },

      setRecommendations: function(data) {
        recommendations.arr = data;
        console.log(recommendations.arr);
      },

      getRecommendations: function() {
        console.log(recommendations.arr);
        return recommendations.arr;
      }
    };
  });
