'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {
    $scope.userData = Auth.getCurrentUser();

    this.tripEditView = function(index) {
        var tripId = $scope.userData.trips[index]._id;
        $http.get('/api/trips/' + tripId).success(function(trip) {
            planData.setCurrentTrip(trip);
            console.log(trip);
            $location.path('/dashboard/' + trip._id);
        })
    };

    this.createTrip = function() {
        $location.path('/newtrip');
    };
  });
