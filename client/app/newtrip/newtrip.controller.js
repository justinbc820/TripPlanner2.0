'use strict';

angular.module('tripPlannerApp')
  .controller('NewtripCtrl', function ($scope, Auth, $location, $window, $http, User, planData, ngDialog) {

    this.questionnaire = {};
    this.historyNodes = [];
    this.autocomplete = {
      options: {
        types: '(regions)'
      },
      details: {}
    };

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

    this.signup = function() {
      ngDialog.open({template: 'signup.html', controller: 'SignupCtrl'});
    };

    this.done = function(answers) {
      var self = this;
      $http.post('/api/trips', {questionnaire: this.questionnaire})
        .success(function(trip) {
          planData.setTrip(trip._id);
          self.signup();
        });

    };


  }); //END HERE
