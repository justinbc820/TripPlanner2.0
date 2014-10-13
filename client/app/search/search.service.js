'use strict';

angular.module('tripPlannerApp')
  .factory('search', function ($rootScope, ngGPlacesAPI) {

    // This object represents markers of up to 200 places returned
    // from a google radar search.  They all represent a different type
    var radarSearchMarkers = {
      restaurant: [], 
      lodging: [], 
      laundry: [], 
      playthings: [],
      tourist: [],
      amusement: [],
      monument:[],
      // This array represents marker items returned from Autocomplete textbox
      textSearch:[]
    };

    var currentDayMarkers; //This represents an array that contains marker coords, id
    // and google details information for each place in the activities of the current day

    // This object represents the returned values of a details call to Google
    // It will have keys of Google place ids and values of objects with full details
    var details = {};

    // This is a constructor function that makes each marker to place on the map
    // after a radar search.
    function Marker(idNum, marker) {
      return {
      id: idNum,
      latitude: marker.geometry.location.k,
      longitude: marker.geometry.location.B,
      place_id: marker.place_id
      };
    };

    // This object contains search bounds for the map based on the current Trip or the
    // current map viewport when it is resized or zoomed in or out
    var searchBounds = {};

    // Public API here
    return {
      // This function takes the raw data returned from a radar Search, loops through
      // each object and formats them into the radarSearchMarkers object.
      setMarkers: function (key, array) {
        // if it's not an array, but an object with one marker, do the following.
        // this would be the case when someone selects an option from the autocomplete
        // list rather than from a text search or radar search.
        if(array.geometry) {
          array = [{geometry: array.geometry, place_id:array.place_id}];
        }
        radarSearchMarkers[key].length = 0; // reset markers of a type of search back to nothing
        for (var i=0, n=array.length; i < n; i++) {
          radarSearchMarkers[key].push(new Marker(i, array[i]));
        }
        // sends a message to map controller to update markers on the DOM
        $rootScope.$broadcast('radarResults', key);
      },
      getMarkers: function(key) {
        // key is a type of markers, these types are in the radarSearchMarkers object
        return radarSearchMarkers[key];
      },
      
      // This function is called from the mapOverlay controller or the map controller.
      // It makes a placeDetails call to Google API.
      getDetails: function(place_id) {
        ngGPlacesAPI.placeDetails({placeId: place_id})
          .then(function (data) {
            details[place_id] = data;
            $rootScope.$broadcast('detailsReturned', place_id);
          });
      },

      // this differs from the above function because the above function gets details
      // from Google, while this one simply is called from the overlay controller and
      // returns the results to that controller
      getReturnedDetails: function(place_id) {
        return details[place_id];
      },

      // This is called whenever someon zooms the map or pans it or when a map loads
      setSearchBounds: function(newBounds) {
        searchBounds = newBounds;
        $rootScope.$broadcast('newSearchBounds');
      },

      getSearchBounds: function() {
        return searchBounds;
      },

      // This is called when someone clicks on a specific day in map overlay.
      setDayMarkers: function(places) {
        currentDayMarkers = places;
        $rootScope.$broadcast('newDayMarkers');
      },

      getDayMarkers:function() {
        return currentDayMarkers;
      },

      radarSearchMarkers:radarSearchMarkers
    };
  });
