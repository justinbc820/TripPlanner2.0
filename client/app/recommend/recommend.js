'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recommend', {
        url: '/recommend/:tripid',
        templateUrl: 'app/recommend/recommend.html',
        controller: 'RecommendCtrl'
      });
  });