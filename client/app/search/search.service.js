'use strict';

angular.module('tripPlannerApp')
  .factory('search', function ($rootScope) {
    // Service logic
    // ...

    var radarSearchMarkers = {restaurant: [], lodging: [], laundry: [], playthings: []};

    function Marker(idNum, marker) {
      return {
      id: idNum,
      longitude: marker.geometry.location.B,
      latitude: marker.geometry.location.k
      };
    }

    // Public API here
    return {
      setMarkers: function (key, array) {
          radarSearchMarkers[key].length = 0;
          for (var i=0, n=array.length; i < n; i++) {
            radarSearchMarkers[key].push(new Marker(i, array[i]));
          }
        $rootScope.$broadcast('radarResults', key);
      },
      getMarkers: function(key) {
        return radarSearchMarkers[key];
      },
      radarSearchMarkers:radarSearchMarkers
    };
  });
