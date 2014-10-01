'use strict';

angular.module('tripPlannerApp')
  .controller('PlanCtrl', function ($scope, planData) {
  	this.toggleView = function(view) {
  		planData.toggleView(view);
  	}
  });
