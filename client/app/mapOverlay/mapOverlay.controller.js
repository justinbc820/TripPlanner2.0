'use strict';

angular.module('tripPlannerApp')
  .controller('MapOverlayCtrl', function ($scope, planData) {
    this.toggleView = function(view) {
    	planData.toggleView(view);
    }
  });
