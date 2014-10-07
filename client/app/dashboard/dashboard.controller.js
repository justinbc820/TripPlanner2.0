'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {
    this.getCurrentUser = Auth.getCurrentUser;
    this.userData = this.getCurrentUser();

    $scope.createTrip = function() {
    	$http.post('/api/trips/').success(function(trip) {
    		planData.setCurrentTrip(trip);
    		$location.path('/map');
    	});
    };
  });
