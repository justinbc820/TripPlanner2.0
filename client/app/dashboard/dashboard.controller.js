'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {
    this.getCurrentUser = Auth.getCurrentUser;
    $scope.userData = this.getCurrentUser();

    this.tripEditView = function(tripId) {
        $http.get('/api/trips/' + tripId).success(function(trip) {
            planData.setCurrentTrip(trip);
            console.log(trip);
            $location.path('/dashboard/' + trip._id);
        })
    };

    this.createTrip = function() {
        // This function creates a new trip, saves it in Mongo, then sets the 
        // current trip variable on planData's scope.
    	$http.post('/api/trips/').success(function(trip) {
    		planData.setCurrentTrip(trip);
            $http.get('/api/users/me').success(function(user) {
                var userId = user._id;
                $http.put('/api/users/' + userId, {
                    id:trip._id
                }).success(function(user) {
                    $scope.userData = user;
                })
            })
    		// $location.path('/map');
    	});
    };
  });
