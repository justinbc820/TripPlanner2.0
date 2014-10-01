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
<<<<<<< HEAD
        // self.user = Auth.getCurrentUser();
        self.user.trips = data._id;
=======
        console.log(data);
>>>>>>> f690a7c3550c357ba5b663945a8e43be64f8b0de
        self.currTrip = data;
      });
    };



    this.getNext = function(nextId, answer) {
      var self = this;
      console.log(self);
      if (!self.currTrip.questionnaire) {self.currTrip.questionnaire = {};}

      self.currTrip.questionnaire[self.currNode.name] = answer;
      self.currNode.answer = answer;
      self.historyNodes.push(self.currNode);

      console.log(self.historyNodes);

      $http.put('/api/trips/'+self.currTrip._id, self.currTrip).success(function(data) {
          $http.get('/api/nodes/'+ nextId).success(function(data) {
            self.currNode = data;
            console.log(self.currNode);
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
          self.createTrip();
        })
        .then(function() {
          self.user = Auth.getCurrentUser();
        })
        .then(function() {
          console.log(self.user);
          self.user['trips'].push(self.currTrip._id);
        })
        .then(function() {
          self.getFirstNode();
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

