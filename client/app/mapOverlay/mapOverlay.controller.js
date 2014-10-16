'use strict';

angular.module('tripPlannerApp')
    .controller('MapOverlayCtrl', function($scope, $rootScope, $interval, $timeout, planData, ngGPlacesAPI, search, $http, $modal) {

      $http.get('/api/users/me').success(function(user) {
        $scope.userData=user;
      });

      var selectTripModal = $modal({title: 'SELECT A TRIP', template: 'app/mapOverlay/tripPicker.html', show: false, placement: 'center'});

      $rootScope.$on('showSelectTripModal', function() {
        selectTripModal.$promise.then(selectTripModal.show);
      });

      $rootScope.$on('closeTripPickerModal', function() {
        if (!selectTripModal) {

        }
        selectTripModal.$promise.then(selectTripModal.hide);
      });

      $scope.closeTripPickerModal = function() {
        $rootScope.$broadcast('closeTripPickerModal');
      };

      $scope.setCurrentTrip = function(trip) {
        trip.wishlist.push(planData.getTempActivity());
        planData.setCurrentTrip(trip);
      };
      /*
       *  This function waits for a message from the Search Factory that indicates that
       *  the user has changed map bounds, either by resizing or relocating. Once it
       *  receives the message, it changes all search bounds to limit to the current
       *  map view
      */
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
          planData.setMapOpts(null, null, $scope.search.options.bounds);
          $scope.search.coords.centerLat = rawBounds.southwest.latitude + ((rawBounds.northeast.latitude - rawBounds.southwest.latitude)/2);
          $scope.search.coords.centerLong = rawBounds.southwest.longitude + ((rawBounds.northeast.longitude - rawBounds.southwest.longitude)/2)
        }
      });

      // This gives the map overlay access to the global current Trip available in planData
      // With this information, the day selector is populated with the correct days
      $scope.currentTrip = planData.getCurrentTrip();
      $rootScope.$on('newCurrentTrip', function() {
        $scope.currentTrip = planData.getCurrentTrip();
        $scope.selectedDay = $scope.currentTrip.days[0]; // initializes the current selected day to the first day of the trip
        $scope.selectedDayCss = 3; // applies the 'selected' css to the selected day
      });

      $scope.currentDayActivities = []; // this array represents markers on the map showing the current day's activities

      /*
       * This function is called when someone selects a day button from the bottom of
       * the map overlay. It changes the css to reflect the current selected day.
       * It also runs a for loop to find all activities that match the selected day
       * and then puts markers on the map for each activity in the current day
      */
      $scope.daySelect = function(index) {
            $scope.selectedDayCss = index;
            $scope.selectedDay = $scope.currentTrip.days[index];
            $scope.currentDayActivities.length = 0; // reset array
            var currDayString = $scope.selectedDay.slice(0,10); //Gets the day selected YYYY-MM-DD
            var activitiesSkipped = 0;
            for(var i=0; i<$scope.currentTrip.activities.length; i++) {
              var currActivityString = $scope.currentTrip.activities[i].start.slice(0,10);//Gets the date of activity YYYY-MM-DD
              if(currDayString == currActivityString) { // if the activity happens on the currently selected day...
                $scope.currentDayActivities.push($scope.currentTrip.activities[i]);
                //formatting each location so that the markers directive in the html can place markers
                var newIndex = i - activitiesSkipped; // This variable keeps track of the current position in the for loop, relative to the
                                                      // position of each place in the actual currentDayActivities array.
                if($scope.currentDayActivities[newIndex].googleDetails.location) {
                  $scope.currentDayActivities[newIndex].id = newIndex;
                  $scope.currentDayActivities[newIndex].latitude = $scope.currentDayActivities[newIndex].googleDetails.location.coords.latitude;
                  $scope.currentDayActivities[newIndex].longitude = $scope.currentDayActivities[newIndex].googleDetails.location.coords.longitude;
                } else {
                  continue;
                }
              } else {
                activitiesSkipped++;
              }
            }
            search.setDayMarkers($scope.currentDayActivities);
      };

      // This array stores information for each of the radar search icons
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
      }];

      // This function is called when someone clicks on one of the radar search icons
      this.iconRadarSearch = function(index) {
          var self = this;
          var searchType = self.radarIcons[index].details;
          self.radarSearch(searchType);
      };

      // This function is called when someone uses the text box.  It determines whether
      // to do a details call or a text search, then does it.
      this.placesSearch = function(autocomplete) {
          var alreadyDetails = false; // indicates if details have been returned from autocomplete

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
              if (!alreadyDetails) { // if autocomplete didn't return details
                  ngGPlacesAPI.textSearch({
                          'query': $scope.search.autocomplete,
                          // 'location': new google.maps.LatLng(
                          //   $scope.search.coords.centerLat,
                          //   $scope.search.coords.centerLong
                          // ),
                          'latitude': $scope.search.coords.centerLat,
                          'longitude': $scope.search.coords.centerLong,
                          'radius': 10000
                      })
                      .then(function(data) {
                          search.setMarkers('textSearch', data);
                      });
              }
          }, 500);
      };

      // THis function does a radar search based on the values passed from the radar
      // icons.  The values are specified in the radarIcons array in this document
      // in the details property of each object
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

      // This function is called when someone clicks the addToTrip button in map overlay
      // the place already has all its details fetched, so we pass those to the function

      this.addToTrip = function() {
            if (planData.getCurrDetails()) {
              planData.addToTrip($scope.currDetails, $scope.selectedDay);
            }


          // currDetails is a variable that holds the current details displayed on map
          // overlay when someone clicks on a pin

      };

          /*
           * This function is run when the search service broadcasts that details have
           * been returned from Google. If there if a photo in the returned details,
           * the function sets the width and height and passes the url on to the html
           * to populate the orange-hued place picture.
          */
            $rootScope.$on('detailsReturned', function(event, placeId) {
              console.log("called detailsReturned")
                $scope.currDetails = search.getReturnedDetails(placeId);
                planData.setCurrDetails($scope.currDetails);
                if($scope.currDetails.photos) {
                  var width = $scope.currDetails.photos[0].width;
                  var height = $scope.currDetails.photos[0].height;
                  $scope.currDetails.photoUrl = $scope.currDetails.photos[0].getUrl({
                      'maxWidth': width,
                      'maxHeight': height
                  });
                }
                console.log($scope.currDetails, placeId)
            });
});