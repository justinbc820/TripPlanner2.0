'use strict';

angular.module('tripPlannerApp')
  .controller('MainCtrl', function ($scope, Auth, $location, $window, $http) {

    this.user = {};
    this.errors = {};
    this.currNode = {};


    this.getFirstNode = function() {
      var self = this;
      $http.get('/api/nodes').success(function(data) {
        self.currNode = data[0];
      });
    };

    this.getFirstNode();


    this.createTrip = function() {
      var self = this;
      this.historyNodes = [];
      $http.post('/api/trips/').success(function(data) {
        Auth.getCurrentUser().trips.push(data._id);
        self.currTrip = data;
      });
    };



    this.getNext = function(nextId, answer) {
      var self = this;
      if (!self.currTrip.questionnaire) {self.currTrip.questionnaire = {};}

      self.currTrip.questionnaire[self.currNode.name] = answer;
      self.currNode.answer = answer;
      self.historyNodes.push(self.currNode);

      console.log(self.historyNodes);

      $http.put('/api/trips/'+self.currTrip._id, self.currTrip).success(function(data) {
          console.log("answer stored on database");
          $http.get('/api/nodes/'+ nextId).success(function(data) {
            self.currNode = data;
            console.log("currNode is now", self.currNode);
          });
      });
    };

    this.register = function(form) {
      this.submitted = true;
      var self = this;

      if(form.$valid) {
        Auth.createUser({
          // name: this.user.name,
          email: this.user.email,
          name: this.user.name,
          password: this.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .then(function() {
          self.getFirstNode();
        })
        .then(function() {
          console.log(self);
          self.createTrip();
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

