'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('plan', {
        url: '/plan',
        templateUrl: 'app/plan/plan.html',
        controller: 'PlanCtrl'
      });
  });