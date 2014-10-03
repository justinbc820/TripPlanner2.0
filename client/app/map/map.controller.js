'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, $rootScope, planData) {
    var currentTrip = planData.getCurrentTrip();
  	this.map = {
  	  center: {
  	      latitude: currentTrip.location.latitude,
  	      longitude: currentTrip.location.longitude
  	  },
  	  zoom: 11
  	};

    $scope.markers = {
      array: [
        {id:0, latitude: -122.42164300000002, longitude: 37.773624},
        {id:1, latitude: -122.41299800000002, longitude: 37.786942}
      ]
    };

  	this.showMap = function() {
  		return planData.getMapStatus();
  	};

    // this.getRadarSearch = function() {
    //   this.markers = planData.getRadarSearch();
    //   // return planData.getRadarSearch();
    // };
    // $rootScope.$on('radarSearch', function() {
    //   console.log("it updated");
    //   $scope.markers = planData.getRadarSearch().slice(0,15);
    //   console.log($scope.markers);
    // });

  });
