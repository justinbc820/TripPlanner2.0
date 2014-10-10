'use strict';

angular.module('tripPlannerApp')
  .controller('RecommendCtrl', function ($scope, planData, $stateParams) {
    var tripId = $stateParams.tripid;
    var getRecommendations = function() {
      planData.getRecommendations(tripId).success(function(data) {
        $scope.recommendations = data.recommendations[0].array;
        $scope.destination = data.questionnaire.location;
        console.log("returned", data);
      });
    };
    getRecommendations();
  });
