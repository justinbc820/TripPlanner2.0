'use strict';

angular.module('tripPlannerApp')
  .controller('SignupCtrl', function ($scope, Auth, $modal, $location, $window, planData, $http) {

    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
        })
        .then( function() {
          // Account created, redirect to home
          $http.get('/api/users/me').success(function(data) {
            var userId = data._id;
            console.log(data);
            var tripId=planData.getTrip();
            $http.put('/api/users/'+userId, {id: tripId}).success(function(data) {
              planData.setInitialTrip(data);

              $http.put('/api/trips/'+tripId, {travelerId: userId}).success(function(data) {
                console.log("saved travelerId:", data);
                $location.path('/plan');
              });
            });
          });
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };


  });
