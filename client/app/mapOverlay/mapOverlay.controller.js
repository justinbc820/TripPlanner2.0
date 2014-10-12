'use strict';

angular.module('tripPlannerApp')
    .controller('MapOverlayCtrl', function($scope, $rootScope, $interval, $timeout, planData, ngGPlacesAPI, search) {

      $rootScope.$on('newSearchBounds', function() {
        if(search.getSearchBounds().northeast) {
          $scope.search = {
            autocomplete: undefined,
            details: {},
            options: {
              bounds: {},
            },
            coords:{}
          };
          var rawBounds = search.getSearchBounds();
          var SW = new google.maps.LatLng(rawBounds.southwest.latitude, rawBounds.southwest.longitude);
          var NE = new google.maps.LatLng(rawBounds.northeast.latitude, rawBounds.northeast.longitude);
          $scope.search.options.bounds = new google.maps.LatLngBounds(SW,NE);
          $scope.search.coords.centerLat = rawBounds.southwest.latitude + ((rawBounds.northeast.latitude - rawBounds.southwest.latitude)/2);
          $scope.search.coords.centerLong = rawBounds.southwest.longitude + ((rawBounds.northeast.longitude - rawBounds.southwest.longitude)/2)
        }
      })

      $scope.currentTrip = planData.getCurrentTrip();
      $rootScope.$on('newCurrentTrip', function() {
        $scope.currentTrip = planData.getCurrentTrip();
        $scope.selectedDay = $scope.currentTrip.days[0];
        $scope.selectedDayCss = 0;
      });


      $scope.daySelect = function(index) {
        $scope.selectedDayCss = index;
        $scope.selectedDay = $scope.currentTrip.days[index];
        console.log($scope.selectedDay);
      }

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

      this.placesSearch = function(autocomplete) {
          var self = this;
          var alreadyDetails = false;

          // If something is selected from the autocomplete list, the user wants that
          // specific location, not 20 search results, so, this function will check 10
          // times within 500ms to see if there are any place details.  If there aren't,
          // then it's assumed that we should query google for a list of results rather
          // than just the details of the place that they selected.


          // The autocomplete will populate $scope.search.details if a specific place is
          // returned from the autocomplete
          var checkForDetails = $interval(function() {
              if ($scope.search.details !== undefined) {
                  $interval.cancel(checkForDetails);
                  search.setMarkers('textSearch', $scope.search.details);
                  $scope.search.details = undefined;
                  alreadyDetails = true;
              }
          }, 50, 10);

          $timeout(function() {
              if (!alreadyDetails) {
                  ngGPlacesAPI.textSearch({
                          'query': $scope.search.autocomplete,
                          'location': new google.maps.LatLng(
                            $scope.search.coords.centerLat,
                            $scope.search.coords.centerLong
                          ),
                          'radius': 10000
                      })
                      .then(function(data) {
                          search.setMarkers('textSearch', data);
                      });
              }
          }, 500);
      };

      this.radarSearch = function(type) {
        ngGPlacesAPI.radarSearch({
                // populate location based on survey
                'location': new google.maps.LatLng(
                  $scope.search.coords.centerLat,
                  $scope.search.coords.centerLong
                ),
                'radius': 50000,
                'keyword': type
            })
            .then(function(data) {
                search.setMarkers(type, data);
            });
        $rootScope.$broadcast('radarResults', type);
      };

      this.end = {};

      this.addToTrip = function(details) {
        planData.addToTrip(details);
      };

      $rootScope.$on('detailsReturned', function(event, placeId) {
          $scope.currDetails = search.getReturnedDetails(placeId);
          if($scope.currDetails.photos) {
            var width = $scope.currDetails.photos[0].width;
            var height = $scope.currDetails.photos[0].height;
            $scope.currDetails.photoUrl = $scope.currDetails.photos[0].getUrl({
                'maxWidth': width,
                'maxHeight': height
            });
          }
      });

});