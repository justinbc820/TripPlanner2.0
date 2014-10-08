'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData) {
  	$scope.currentTrip = planData.getCurrentTrip();
    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
    	console.log($scope.currentTrip);
    });

    $scope.updateTrip = function(updatedTrip) {
    	$http.put('/api/trips/' + $scope.currentTrip._id, {
    		// Send trip to backend, update with newly changed trip
    	})
    };

    $scope.$watch('currentTrip', function(newVal, oldVal) {
    	$scope.updateTrip(newVal);
    }, true);
  });
