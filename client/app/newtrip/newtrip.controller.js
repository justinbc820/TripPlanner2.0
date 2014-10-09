'use strict';

angular.module('tripPlannerApp')
  .controller('NewtripCtrl', function ($scope, Auth, $location, $window, $http, User, planData, ngDialog) {
    this.getCurrentUser = Auth.getCurrentUser;
    $scope.currentUser = this.getCurrentUser();

    $scope.isLoggedIn = Auth.isLoggedIn;
    this.questionnaire = {};
    this.historyNodes = [];
    $scope.setupTrip = {};
    $scope.justAnsweredNode = 0;

    $scope.setupTrip = {
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
      $scope.justAnsweredNode = self.currNode.num;
      console.log(self.currNode);

      $http.get('/api/nodes/'+ nextId).success(function(data) {
          self.currNode = data;
      });
    };

    this.getPrev = function() {
      var prevNode = this.historyNodes.pop();
      this.currNode = prevNode;
    };

    this.signup = function() {
      ngDialog.open({template: 'signup.html', controller: 'SignupCtrl'});
    };


    $scope.getRecommendations = function(lat, lng, loc) {
      $http.post('/api/getrecommendations/'+lat+'/'+lng, {location: loc}).success(function(data) {
        planData.setRecommendations(data);
        console.log(data);
      });
    };

    $scope.$watch('justAnsweredNode', function(oldval, newval) {
      if (newval === 2) {
        var lat = $scope.setupTrip.details.geometry.location.k;
        var lng = $scope.setupTrip.details.geometry.location.B;
        var loc = $scope.setupTrip.autocomplete;
        $scope.getRecommendations(lat, lng, loc);
      }
    }, true);

    this.done = function(answers) {
      var self = this;
      self.questionnaire.location = $scope.setupTrip.autocomplete;
      self.questionnaire.date = $scope.setupTrip.daterange;
      $http.post('/api/trips', {questionnaire: this.questionnaire})
        .success(function(trip) {
          planData.setTrip(trip._id);
          if(!$scope.isLoggedIn()) {
            self.signup();
          } else {
            $http.put('/api/users/' + $scope.currentUser._id, {
              id:trip._id
            }).success(function(updatedUser) {
              console.log(updatedUser);
              $location.path('/dashboard');
            })
          }
        });
    };
  }); //END HERE
