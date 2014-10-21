'use strict';

angular.module('tripPlannerApp')

.controller('SignupCtrl', function($scope, Auth, $location, $window, planData, $http, $rootScope, $modal) {

  $scope.user = {};
  $scope.errors = {};

  var loginModal = $modal({
    title: 'LOGIN',
    template: 'app/account/login/login.html',
    show: false,
    placement: 'center'
  });

  $scope.register = function(form) {

    $scope.submitted = true;

    if (form.$valid) {
      Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
        })
        .then(function() {
          $rootScope.$broadcast('signedUp');



          if (!planData.getTripIdReminder() && !planData.getTempActivity) {

            //If logging in direct from front page, there will be no tripIdReminders or tempActivity stored in planData factory

            $location.path('/newtrip');

          } else if (planData.getAcceptTripUser()) {
              $http.get('/api/users/me').success(function(user) {
                var userId = user._id;
                var tripId = planData.getAcceptTripUser().tripId;
                var token = planData.getAcceptTripUser().token;
                $http.put('/api/users/' + userId, {
                  tripId : tripId
                }).success(function(user) {
                  console.log('got here');
                  $http.put('/api/trips/'+tripId+'/acceptinvite', {
                    travelerId: userId,
                    token: token
                  }).success(function(trip) {
                    $location.path('/dashboard');
                  });
                });
              });
          } else if (!planData.getTripIdReminder() && planData.getTempActivity()){

              //if user is signing up without any tripIdReminder stored in plandata but there is a tempActivity, this means an unregistered user is signing up after adding activity

              //newtrip will create the new tripid and update the trip and user


              //new user created, redirect to /newtrip
              $location.path('/newtrip');


          }  else {
            $http.get('/api/users/me').success(function(user) {
              var userId = user._id;
              var tripId = planData.getTripIdReminder();
              $http.put('/api/users/' + userId, {
                tripId: tripId
              }).success(function(trip) {

                if (tripId) {
                  $http.put('/api/trips/' + tripId, {
                    travelerId: userId
                  }).success(function(trip) {
                    planData.setCurrentTrip(trip);
                    if ($location.url() === '/newtrip') {
                      $location.path('/recommend/' + tripId);
                    } else {
                      $location.path('/newtrip');
                    }
                  });
                } else {
                  $location.path('/newtrip');
                }
              });
            });
          }
        })
        .catch(function(err) {
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

  this.login = function() {
    $rootScope.$broadcast('closeSignupModalAndDisplayLogin');
  };
});
