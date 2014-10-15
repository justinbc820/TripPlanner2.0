'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, $rootScope, planData, search, $timeout) {

    // $scope.currDetails = {};

    // This object contains the center LatLng and the zoom level of the map
    $scope.currentMapOpts = planData.getMapOpts();

    // Whenever planData currentTrip is updated, this sets the map options and updates the map
    $rootScope.$on('newCurrentTrip', function(event) {
      $scope.currentMapOpts = planData.getMapOpts();
      $scope.map.center.latitude = $scope.currentMapOpts.location.k;
      $scope.map.center.longitude = $scope.currentMapOpts.location.B;
      $scope.map.zoom = $scope.currentMapOpts.zoom;
    });

    // when search factory has new markers representing the activities of a day, this updates them
    $rootScope.$on('newDayMarkers', function() {
      $scope.currentDayMarkers = search.getDayMarkers();
      console.log($scope.currentDayMarkers);
    });

    // This watches for someone to resize or pan the map and then updates the current
    // search parameters to that searches are biased within the viewport
    $scope.$watch('map.bounds', function(newVal, oldVal) {
      if(newVal) {
        search.setSearchBounds(newVal);
      }
    }, true);

    // This object contains map options including styling options
  	$scope.map = {
      bounds:{},
  	  center: {
  	      latitude: $scope.currentMapOpts.location.k,
  	      longitude: $scope.currentMapOpts.location.B
  	  },
      zoom: $scope.currentMapOpts.zoom,
      options: {
        zoomControlOptions: {
          position:google.maps.ControlPosition.LEFT_BOTTOM,
          style:google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
          position:google.maps.ControlPosition.RIGHT_BOTTOM
        },
        tilt:45,
        panControl:false,
        styles: [
          {
              "featureType": "water",
              "stylers": [{
                  "saturation": -50
              }, {
                  "lightness": -11
              }, {
                  "hue": "#0088ff"
              }]
          }, {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [{
                  "hue": "#FDBB53"
              }, {
                  "saturation": 100
              }, {
                  "lightness": 0
              }]
          }, {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{
                  "color": "#FDBB53"
              }, {
                  "lightness": 0
              }]
          }, {
              "featureType": "landscape.man_made",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#ece2d9"
              }]
          }, {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#ccdca1"
              }]
          }, {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#767676"
              }]
          }, {
              "featureType": "road",
              "elementType": "labels.text.stroke",
              "stylers": [{
                  "color": "#ffffff"
              }]
          }, {
              "featureType": "poi",
              "stylers": [{
                  "visibility": "off"
              }]
          }, {
              "featureType": "landscape.natural",
              "elementType": "geometry.fill",
              "stylers": [{
                  "visibility": "off"
              }, {
                  "color": "#b8cb93"
              }, {
                  "saturation": -60
              }]
          }, {
              "featureType": "poi.park",
              "stylers": [{
                  "visibility": "on"
              }]
          }, {
              "featureType": "poi.sports_complex",
              "stylers": [{
                  "visibility": "on"
              }]
          }, {
              "featureType": "poi.medical",
              "stylers": [{
                  "visibility": "on"
              }]
          }, {
              "featureType": "poi.business",
              "stylers": [{
                  "visibility": "simplified"
              }]
          }]
        }
  	};

    $scope.markersEvents = {
      //'click' property here is the 'onClicked' under the click tag in the markers directive in map.html
      click: function (gMarker, eventName, model) {
        if(model.$id) {
          model = model.coords;
        }
        search.getDetails(model.place_id);
      }
    }

  	// this.showMap = function() {
  	// 	return planData.getMapStatus();
  	// };

    // When radar results are available from the search factory, this updates the variable
    // in the scope
    $rootScope.$on('radarResults', function(event, key) {
      // event parameter is unimportant, but the key is the type of results we are looking
      // for when we call getMarkers, such as 'lodging' or 'monuments'
      $scope.markers = search.getMarkers(key);
    });


  });
