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
      monument:[]
    };

    // This object represents the returned values of a details call to Google
    // It will have keys of Google place ids and values of objects with full details
    var details = {};

    // This is a constructor function that makes each marker to place on the map
    // after a radar search.
    function Marker(idNum, marker) {
      return {
      id: idNum,
      longitude: marker.geometry.location.B,
      latitude: marker.geometry.location.k,
      place_id: marker.place_id
      };
    }

    // Public API here
    return {
      // This function takes the raw data returned from a radar Search, loops through
      // each object and formats them into the radarSearchMarkers object.
      setMarkers: function (key, array) {
        radarSearchMarkers[key].length = 0;
        for (var i=0, n=array.length; i < n; i++) {
          radarSearchMarkers[key].push(new Marker(i, array[i]));
        }
        // sends a message to map controller to update markers on the DOM
        $rootScope.$broadcast('radarResults', key);
      },
      getMarkers: function(key) {
        return radarSearchMarkers[key];
      },
      
      // This function is called from the mapOverlay controller or the map controller.
      // It makes a placeDetails call to Google API
      getDetails: function(place_id) {
        ngGPlacesAPI.placeDetails({placeId: place_id}).then(function (data) {
          details[place_id] = data;
          $rootScope.$broadcast('detailsReturned', place_id);
        });
      },
      getReturnedDetails: function(place_id) {
        return details[place_id];
      },
      radarSearchMarkers:radarSearchMarkers
    };
  });
