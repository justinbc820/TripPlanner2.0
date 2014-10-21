'use strict';

angular.module('tripPlannerApp')
  .controller('MainCtrl', function ($scope, Auth, $location, $window, $http, User, $aside) {
    this.user = {};
    this.errors = {};
    $scope.newUser = Auth.getCurrentUser();
    this.questionnaire = {};
    this.historyNodes = [];

    this.getFirstNode = function() {
      var self = this;
      $http.get('/api/nodes').success(function(data) {
        self.currNode = data[0];
      });
    };

    this.getFirstNode();

    this.getNext = function(nextId, answer) {
      var self = this;
      self.questionnaire[self.currNode.name] = answer;
      self.currNode.answer = answer;
      self.historyNodes.push(self.currNode);

      $http.get('/api/nodes/'+ nextId).success(function(data) {
          self.currNode = data;
      });
    };

    this.getPrev = function() {
      var prevNode = this.historyNodes.pop();
      this.currNode = prevNode;
    };

  this.register = function(form) {
      this.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $scope.newUser = Auth.getCurrentUser();
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
      }
    };

    this.doneQuestionnaire = function() {
      $scope.$apply();
      $http.post('/api/trips', { userId : $scope.newUser._id,
                                 questionnaire: this.questionnaire })
        .success(function(trip) {
          planData.setCurrentTrip(trip);
          $http.put('/api/users/' + $scope.newUser._id, { tripId: trip._id });
        });
    };
  });

