'use strict';

angular.module('tripPlannerApp')
  .factory('search', function ($rootScope) {
    // Service logic
    // ...

    var radarSearchMarkers = {restaurant: [], hotels: [], attractions: [], playthings: []};

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
          for (var i=0, n=array.length; i < n; i++) {
            radarSearchMarkers[key].push(new Marker(i, array[i]));
          }
        $rootScope.$broadcast('radarResults');
      },
      getMarkers: function(key) {
        return radarSearchMarkers[key];
      }
    };
  });
