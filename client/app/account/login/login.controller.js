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

          //User coming from newtrip questionnaire.  NewTrip's 'done' method will have set currentTrip and set TripIdReminder on planData service

          if (planData.getCurrentTrip() && planData.getTripIdReminder()) {
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

            //Existing user trying to add to trip while not logged in.  User will not have a getTripIdReminder but will have stashed a temp activity in planData.  create trip for them, update trip (with user id) and user (with trip id), broadcast to mapOverlayCtrl to show the select trip modal and redirect to map view
          } else if (!planData.getTripIdReminder() && (planData.getTempActivity() !== undefined)) {
              // $http.post('/api/trips/').success(function(trip) { //create new trip
              //   $http.get('/api/users/me').success(function(user) { //retrieve current user
              //     $http.put('/api/trips/'+trip._id, {travelerId: user._id}).success(function(trip) {
              //       $http.put('/api/users/'+user._id, {tripId: trip._id}).success(function() {

            // $location.path('/map');
            $rootScope.$broadcast('showSelectTripModal');

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
