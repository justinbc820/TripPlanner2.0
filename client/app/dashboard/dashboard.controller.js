'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {

    $scope.userData;

    $http.get('/api/users/me').success(function(user) {
        $scope.userData = user;
        if(planData.getCurrentTrip()) {
            var tripId = planData.getCurrentTrip()._id;
            $http.get('/api/trips/' + tripId).success(function(trip) {
                planData.setCurrentTrip(trip);
                // $location.path('/dashboard/' + trip._id);
            })
        }
    });

    $scope.setCurrentTrip = function(trip) {
        trip.wishlist.push(planData.getTempActivity());
        planData.setCurrentTrip(trip);
    };

    this.tripEditView = function(index) {
        var tripId = $scope.userData.trips[index]._id;
        $http.get('/api/trips/' + tripId).success(function(trip) {
            planData.setCurrentTrip(trip);
            $location.path('/dashboard/' + trip._id);
        })
        // $location.path('/dashboard/' + planData.getCurrentTrip()._id)
        $location.path('/dashboard/' + tripId)
    };

    this.createTrip = function() {
        $location.path('/newtrip');
    };
  });
