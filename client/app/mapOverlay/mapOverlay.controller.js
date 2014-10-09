'use strict';

angular.module('tripPlannerApp')
    .controller('MapOverlayCtrl', function($scope, $rootScope, $interval, $timeout, planData, ngGPlacesAPI, search) {
      // currentTrip will contain high-level data about the trip, especially the
      // location and duration of the trip
      var currentMapOpts = planData.getMapOpts();

      // Sets the autocomplete box to search a location with a radius of meters
      var bounds = new google.maps.Circle({
          center: new google.maps.LatLng(
              currentMapOpts.location.latitude,
              currentMapOpts.location.longitude
          ),
          radius: 5000
      }).getBounds();

      this.details = {};
      $scope.currDetails = false;

      this.radarIcons = [{
          route: '../../assets/images/icons/eiffel.png',
          details: 'monument',
          text: 'see'
      }, {
          route: '../../assets/images/icons/bed.png',
          details: 'lodging',
          text: 'sleep'
      }, {
          route: '../../assets/images/icons/chef-hat.png',
          details: 'restaurant',
          text: 'dine'
      }, {
          route: '../../assets/images/icons/wave.png',
          details: 'amusement',
          text: 'play'
      }, ];

      this.iconRadarSearch = function(index) {
          var self = this;
          var searchType = self.radarIcons[index].details;
          self.radarSearch(searchType);
      }

      this.details = {};

      this.placesSearch = function(autocomplete) {
          var self = this;
          var alreadyDetails = false;
          /*
            If something is selected from the autocomplete list, the user wants that
            specific location, not 20 search results, so, this function will check 10
            times within 500ms to see if there are any place details.  If there aren't,
            then it's assumed that we should query google for a list of results rather
            than just the details of the place that they selected.
            */

          // The autocomplete will populate self.details.details if a specific place is
          // returned from the autocomplete
          var checkForDetails = $interval(function() {
              if (self.details.details !== undefined) {
                  $interval.cancel(checkForDetails);
                  // planData.setSearchResults(self.details.details);
                  search.setMarkers('textSearch', self.details.details);
                  self.details.details = undefined;
                  alreadyDetails = true;
              }
          }, 50, 10);

          $timeout(function() {
              if (!alreadyDetails) {
                  ngGPlacesAPI.textSearch({
                          'query': autocomplete
                      })
                      .then(function(data) {
                          // planData.setSearchResults(data);
                          search.setMarkers('textSearch', data);
                      });
              }
          }, 500);

      };

      this.radarSearch = function(type) {
          if (!search.radarSearchMarkers[type][0]) {
            var lat = currentMapOpts.location.latitude;
            var lng = currentMapOpts.location.longitude;
              ngGPlacesAPI.radarSearch({
                      // populate location based on survey
                      'location': new google.maps.LatLng(lat, lng),
                      'radius': 5000,
                      'keyword': type
                  })
                  .then(function(data) {
                      search.setMarkers(type, data);
                  });
          } else {
              $rootScope.$broadcast('radarResults', type);
          }
      };

      this.end = {};

      this.searchFieldOptions = {
          bounds: bounds
      };

      // this.getSearchResults = function() {
      //     return planData.getSearchResults();
      // };

      this.addToTrip = function(details) {
        planData.addToTrip(details);
      };

      $rootScope.$on('detailsReturned', function(event, placeId) {
          $scope.currDetails = search.getReturnedDetails(placeId);
          if($scope.currDetails.phots) {
            var width = $scope.currDetails.photos[0].width;
            var height = $scope.currDetails.photos[0].height;
            $scope.currDetails.photoUrl = $scope.currDetails.photos[0].getUrl({
                'maxWidth': width,
                'maxHeight': height
            });
          }
      });

});