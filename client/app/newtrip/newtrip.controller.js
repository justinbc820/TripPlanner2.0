'use strict';

angular.module('tripPlannerApp')
  .controller('NewtripCtrl', function ($scope, Auth, $location, $window, $http, User, planData, ngDialog) {


    this.getCurrentUser = Auth.getCurrentUser;
    $scope.currentUser = this.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;


    this.questionnaire = {};
    this.historyNodes = [];

    $scope.justAnsweredNode = 0;

    $scope.setupTrip = {
      destination: {
        options: {
          types: '(regions)'
        },
        details: {}
      },
      lodging: {
        options: {
          types: 'establishment'
        },
        details: {}
      }
    };

    this.getFirstNode = function() {
      var self = this;
      $http.get('/api/nodes').success(function(data) {
        self.currNode = data[0];
      });
    };

    this.getFirstNode(); //Get Node 1 to initialize questionnaire

    ////Questionnaire functionality

    this.getNext = function(nextId, answer) {
      var self = this;
      self.questionnaire[self.currNode.name] = answer;
      self.currNode.answer = answer;
      self.historyNodes.push(self.currNode);
      $scope.justAnsweredNode = self.currNode.num;

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

    ////Tixik/Flickr API call
    $scope.getRecommendations = function(lat, lng, loc) {
      $http.post('/api/getrecommendations/'+lat+'/'+lng, {location: loc}).success(function(data) {
        $scope.recommendations = data;
        console.log("recommendations set", $scope.recommendations);
      });
    };

    $scope.$watch('justAnsweredNode', function(oldval, newval) { //set watcher on node2, fire off the Tixik API /Flickr API after node 2 answered by user
      if (newval === 2) {
        var lat = $scope.setupTrip.destination.details.geometry.location.k;
        var lng = $scope.setupTrip.destination.details.geometry.location.B;
        planData.setMapOpts({latitude:lat, longitude:lng}, 11);
        var loc = $scope.setupTrip.destination.autocomplete;
        $scope.getRecommendations(lat, lng, loc);
      }
    }, true);

    this.done = function(answers) {
      var self = this;
      self.questionnaire.location = $scope.setupTrip.destination.autocomplete;
      self.questionnaire.date = $scope.setupTrip.daterange;
      var daysArray = planData.calculateDays(self.questionnaire.date);
      $http.post('/api/trips', {questionnaire: this.questionnaire, days: daysArray})
      planData.setCurrentTrip
      $http.post('/api/trips', {questionnaire: this.questionnaire})
        .success(function(trip) {
          planData.setCurrentTrip(trip);
          planData.setTripIdReminder(trip._id); //communicating with signup controller to populate new user with this trip's id
          planData.setRecommendations($scope.recommendations); //setting recommendations
          if(!$scope.isLoggedIn()) {  //If user not logged in when questionnaire is finished, signup modal (which also contains the login button) will pop up
            self.signup();
          } else {  //If user is logged in when questionnaire is finished, then redirect to recommendations
            $http.put('/api/users/' + $scope.currentUser._id, {
              id:trip._id
            }).success(function(updatedUser) {
              $location.path('/recommend/'+trip._id); //redirect to recommendations
            })
          }
        });
    };
  }); //END HERE
