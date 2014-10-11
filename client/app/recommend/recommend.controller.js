'use strict';

angular.module('tripPlannerApp')
  .controller('RecommendCtrl', function ($scope, planData, $stateParams, $location) {
    var tripId = $stateParams.tripid;
    var getRecommendations = function() {
      planData.getRecommendations(tripId).success(function(data) {
        $scope.recommendations = data.recommendations[0].array;
        $scope.destination = data.questionnaire.location;
        console.log("returned", data);
      });
    };
    
    this.redirect = function() {
      $location.path('/dashboard/' + tripId);
    };

    getRecommendations();
  });
