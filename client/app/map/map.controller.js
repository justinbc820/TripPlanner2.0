'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, $rootScope, planData, search) {

    $scope.currDetails = {};

    var currentTrip = planData.getCurrentTrip();
  	this.map = {
  	  center: {
  	      latitude: currentTrip.location.latitude,
  	      longitude: currentTrip.location.longitude
  	  },
      zoom: 11,
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

    this.markersEvents = {

      //'click' property here is the 'onClicked' under the click tag in the markers directive in map.html

      click: function (gMarker, eventName, model) {
        console.log(gMarker);
        if(model.$id) {
          model = model.coords;
        }
        // console.log(model.place_id);
        search.getDetails(model.place_id);
      }
    }

  	this.showMap = function() {
  		return planData.getMapStatus();
  	};

    // $scope.getDetails = function(place_id) {
    //   // console.log('called getDetails', place_id);
    //   search.getDetails(place_id);
    // }

    $rootScope.$on('radarResults', function(event, key) {
      console.log("$scope.map", $scope.map);
      $scope.markers = search.getMarkers(key);
      console.log('Marker data: ', $scope.markers);
    });
  });
