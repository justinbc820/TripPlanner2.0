'use strict';

angular.module('tripPlannerApp')
  .controller('MainCtrl', function ($scope, Auth, $location, $window, $http) {

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

      // console.log(self.historyNodes);
      $http.get('/api/nodes/'+ nextId).success(function(data) {
            self.currNode = data;
            console.log("you are now on this node", self.currNode);
      });
      console.log("this is self.questionnaire", self.questionnaire);
    };

    this.getPrev = function() {
      var prevNode = this.historyNodes.pop();
      this.currNode = prevNode;
    };



    this.register = function(form) {
      this.submitted = true;
      var self = this;

      if(form.$valid) {
        Auth.createUser({
          email: this.user.email,
          name: this.user.name,
          password: this.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
          self.getFirstNode();
          // var tripId =self.user.trips[0];
          // $http.get('/api/trips/'+tripId).success(function(newTrip) {
          //   self.currTrip = newTrip;
          // });
        })
        .catch( function(err) {
          err = err.data;
          self.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            self.errors[field] = error.message;
          });
        });
      }
    };


    this.doneQuestionnaire = function() {
      console.log($scope.newUser);
      $scope.$apply();
      $http.post('/api/trips', { userId : $scope.newUser._id,
                                 questionnaire: this.questionnaire })
        .success(function(newTrip) {
          $http.put('/api/users/' + $scope.newUser._id, { tripId: newTrip._id })
            .success(function(data) {
              console.log("user updated with trip id");
            });
        });
    };

    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    this.isActive = function(route) {
      return route === $location.path();
    };

  });

