'use strict';

angular.module('tripPlannerApp')
  .factory('search', function ($rootScope) {
    // Service logic
    // ...

    var radarSearchMarkers = {restaurant: [], hotels: [], attractions: [], playthings: []};

    function Marker(idNum, marker) {
      return {
      id: idNum,
      latitude: marker.geometry.location.B,
      longitude: marker.geometry.location.k
      // placeId: marker.place_id
      };
    }

    // Public API here
    return {
      setMarkers: function (key, array) {
          for (var i=0, n=10; i < n; i++) {
            radarSearchMarkers[key].push(new Marker(i, array[i]));
          }
        $rootScope.$broadcast('radarResults');
      },
      getMarkers: function(key) {
        return radarSearchMarkers[key];
      }
    };
  });
