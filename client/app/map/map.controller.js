'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, $rootScope, planData, search) {


/////////////////////TESTING DIRECTIVE EXAMPLE CODE

// var createRandomMarker = function (i, idKey) {

//             if (!idKey) {
//                 idKey = "id";
//             }

//             var lat_min = -90;
//             var lat_range = 180;
//             var lng_min = -180;
//             var lng_range = 360;

//             var latitude = lat_min + (Math.random() * lat_range);
//             var longitude = lng_min + (Math.random() * lng_range);
//             // Note, the label* properties are only used if isLabel='true' in the directive.
//             var ret = {
//               options: {draggable: true,
//                 labelAnchor: '10 39',
//                 labelContent: i,
//                 labelClass: 'labelMarker'},
//                 latitude: latitude,
//                 longitude: longitude,
//                 title: 'm' + i
//             };
//             ret[idKey] = i;
//             return ret;
//         };

// var markers = [];
// for (var i = 0; i < 200; i++) {
//     markers.push(createRandomMarker(i))
// }
// $scope.randomMarkers = markers;
// console.log($scope.randomMarkers);

/////////////////////END TESTING




    var currentTrip = planData.getCurrentTrip();
  	$scope.map = {
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

  	this.showMap = function() {
  		return planData.getMapStatus();
  	};

    $rootScope.$on('radarResults', function() {
      $scope.map.markers = search.getMarkers('restaurant');
      console.log($scope.map.markers);
    });
  });
