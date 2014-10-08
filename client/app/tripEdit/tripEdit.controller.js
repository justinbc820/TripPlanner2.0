'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData) {
  	$scope.currentTrip = planData.getCurrentTrip();
    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
    });

    $scope.updateTrip = function(updates) {
    	$http.put('/api/trips/' + $scope.currentTrip._id, updates).success(function(updatedTrip) {
            $scope.currentTrip = updatedTrip;
        })
    };

    $scope.$watch('currentTrip', function(newVal, oldVal) {
    	$scope.updateTrip(newVal);
    }, true);
  });
