'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function ($http, $rootScope) {
    var currentTrip = {};

    var currentMapOpts = {
      location: {
        latitude:37.579413,
        longitude:-2.900391
      },
      zoom:3
    }

    var trip = {};

    var currentSearch = {searchResults:[]};

    // Public API here
    return {
      setCurrentTrip: function(trip) {
        currentTrip = trip;
        $rootScope.$broadcast('newCurrentTrip');
      },

      getCurrentTrip: function() {
        return currentTrip;
      },

      setMapOpts: function(coords, zoom) {
        currentMapOpts.location = coords;
        currentMapOpts.zoom = zoom;
      },

      getMapOpts: function() {
        return currentMapOpts;
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
      }

      // setSearchResults: function(data) {
      //   currentSearch.searchResults.length=0;
      //   currentSearch.searchResults = data;
      // },

      // getSearchResults: function() {
      //   return currentSearch.searchResults;
      // }
    };
  });
