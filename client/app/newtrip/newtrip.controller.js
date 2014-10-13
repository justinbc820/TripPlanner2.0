'use strict';

angular.module('tripPlannerApp')
  .controller('NewtripCtrl', function ($scope, Auth, $location, $window, $http, User, planData, ngDialog) {

    var self = this;
    this.getCurrentUser = Auth.getCurrentUser;
    $scope.currentUser = this.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;


    $scope.questionnaire = {};
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
      $scope.questionnaire[self.currNode.name] = answer;
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


    $scope.done = function(answers) {
      $scope.questionnaire.date = $scope.setupTrip.daterange;
      var daysArray = planData.calculateDays($scope.questionnaire.date);
      var latLng = $scope.setupTrip.destination.details.geometry.location;
      $scope.questionnaire.location = $scope.setupTrip.destination.autocomplete;
      $http.post('/api/trips', {
          questionnaire: $scope.questionnaire,
          days: daysArray,
          latLng: latLng
      }).success(function(trip) {
          planData.setCurrentTrip(trip);
          planData.setTripIdReminder(trip._id); //communicating with signup controller to populate new user with this trip's id
          console.log($scope.recommendations);
          planData.setRecommendations($scope.recommendations); //setting recommendations
          if (!$scope.isLoggedIn()) { //If user not logged in when questionnaire is finished, signup modal (which also contains the login button) will pop up
              self.signup();
          } else { //If user is logged in when questionnaire is finished, then redirect to recommendations
              $http.put('/api/users/' + $scope.currentUser._id, {
                  id: trip._id
              }).success(function(updatedUser) {
                  $location.path('/recommend/' + trip._id); //redirect to recommendations
              })
          }
      });
    };


    $scope.stillFetchingRecs = false;

    this.displayLoadingView = function() {
      $scope.stillFetchingRecs = true;
      if ($scope.recommendations) {
        $scope.done($scope.questionnaire);
      }
    };

    $scope.$watch('recommendations', function(newval, oldval) {
      if (newval && $scope.stillFetchingRecs) {
        $scope.done($scope.questionnaire);
      }
    });


  }); //END HERE
