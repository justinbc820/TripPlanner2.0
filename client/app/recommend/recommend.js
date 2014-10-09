'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recommend', {
        url: '/recommend',
        templateUrl: 'app/recommend/recommend.html',
        controller: 'RecommendCtrl'
      });
  });