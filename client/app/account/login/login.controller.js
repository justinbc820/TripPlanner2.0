'use strict';

angular.module('tripPlannerApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $modal, $rootScope, planData) {
    $scope.user = {};
    $scope.errors = {};

    var signUpModal = $modal({title: 'SIGN UP', template: '../app/account/signup/signup.html', show: false, placement: 'center'});


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
          if ($location.url() === '/newtrip') {
            $location.path('/recommend/'+planData.getTripIdReminder());
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
