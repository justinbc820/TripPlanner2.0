'use strict';

angular.module('tripPlannerApp')
  .factory('search', function ($rootScope, ngGPlacesAPI) {
    // Service logic
    // ...

    var radarSearchMarkers = {restaurant: [], lodging: [], laundry: [], playthings: []};
    var details = {};

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
      getDetails: function(place_id) {
        console.log(place_id)
        ngGPlacesAPI.placeDetails({placeId: place_id}).then(function (data) {
          console.log('hello');
          console.log('details data: ', data);
          console.log('details object:', details);
          details[place_id] = data;
          return data;
        });
      },
      radarSearchMarkers:radarSearchMarkers
    };
  });
