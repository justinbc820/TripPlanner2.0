'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newtrip', {
        url: '/newtrip',
        templateUrl: 'app/newtrip/newtrip.html',
        controller: 'NewtripCtrl'
      });
  });