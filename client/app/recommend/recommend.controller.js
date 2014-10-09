'use strict';

angular.module('tripPlannerApp')
  .controller('RecommendCtrl', function ($scope, planData) {

    $scope.recommendations = planData.getRecommendations();
    console.log("recs", $scope.recommendations);
  });
