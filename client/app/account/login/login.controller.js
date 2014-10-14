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

          //!planData.getTripIdReminder() && planData.getTempActivity()

          if (!planData.getCurrentTrip()) {
            console.log("this is tripidReminder", planData.getTripIdReminder());
            //fetch current user
            $http.get('/api/users/me').success(function(user) {

              //update user with new trip reminder id
              $http.put('/api/users/'+user._id, {tripId: planData.getTripIdReminder()}).success(function(user) {
                console.log('updated user', user)

                //update trip with user id
                $http.put('/api/trips/'+planData.getTripIdReminder(), {travelerId: user._id}).success(function(trip) {
                  console.log('updated trip', trip);

                  //trip and user both updated, redirect to recommendations
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
