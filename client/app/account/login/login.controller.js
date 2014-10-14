'use strict';

angular.module('tripPlannerApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $modal, $rootScope, planData, $http) {
    $scope.user = {};
    $scope.errors = {};

    var signUpModal = $modal({title: 'SIGN UP', template: 'app/account/signup/signup.html', show: false, placement: 'center'});


    this.signup = function() {
      signUpModal.show();
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          $rootScope.$broadcast('loggedIn');
          // Logged in, redirect to home
          if (planData.getCurrentTrip()) {
            console.log("this is tripidReminder", planData.getTripIdReminder());
            $http.get('/api/users/me').success(function(user) {
              $http.put('/api/users/'+user._id, {tripId: planData.getTripIdReminder()}).success(function(user) {
                console.log('updated user', user)
                $http.put('/api/trips/'+planData.getTripIdReminder(), {travelerId: user._id}).success(function(trip) {
                  console.log('updated trip', trip);
                  $location.path('/recommend/'+planData.getTripIdReminder());
                });
              });
            });
          } else {
            $location.path('/dashboard');
          }
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.signup = function() {
      $rootScope.$broadcast('closeLoginModalAndDisplaySignup');
    }
  });
