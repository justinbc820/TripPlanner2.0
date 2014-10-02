'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, planData) {
    var currentTrip = planData.getCurrentTrip();
  	this.map = {
  	  center: {
  	      latitude: currentTrip.location.latitude,
  	      longitude: currentTrip.location.longitude
  	  },
  	  zoom: 11
  	};

  	this.showMap = function() {
  		return planData.getMapStatus();
  	};
  });
