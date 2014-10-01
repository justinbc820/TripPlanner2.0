'use strict';

angular.module('tripPlannerApp')
  .controller('MapCtrl', function ($scope, planData) {
  	this.map = {
  	  center: {
  	      latitude: 45,
  	      longitude: -73
  	  },
  	  zoom: 8
  	};

  	this.showMap = function() {
  		return planData.getMapStatus();
  	}
  });
