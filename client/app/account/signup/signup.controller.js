'use strict';

angular.module('tripPlannerApp')

    .controller('SignupCtrl', function($scope, Auth, $location, $window, planData, $http, $rootScope, $modal) {

        $scope.user = {};
        $scope.errors = {};

        var loginModal = $modal({title: 'LOGIN', template: '../app/account/login/login.html', show: false, placement: 'center'});

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

                        if (!planData.getTripIdReminder()) {
                            $location.path('/newtrip');
                        } else {
                            $http.get('/api/users/me').success(function(data) {
                                var userId = data._id;
                                var tripId = planData.getTripIdReminder();
                                $http.put('/api/users/' + userId, {
                                    id: tripId
                                }).success(function(data) {
                                    // planData.setInitialTrip(data);

                                    if(tripId) {
                                           $http.put('/api/trips/' + tripId, {
                                            travelerId: userId
                                        }).success(function(trip) {
                                            planData.setCurrentTrip(trip);
                                            if ($location.url() === '/newtrip') {
                                                $location.path('/recommend/'+tripId);
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