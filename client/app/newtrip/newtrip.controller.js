'use strict';

angular.module('tripPlannerApp')
  .controller('NewtripCtrl', function ($scope, Auth, $location, $window, $http, User, planData, $rootScope) {

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
      $rootScope.$broadcast('showSignupModal');
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
          console.log("previous getTripIdReminder:", planData.getTripIdReminder());

          //communicating with signup controller to populate new user with this trip's id

          planData.setTripIdReminder(trip._id);
          console.log("changed TripIdReminder:", planData.getTripIdReminder());

          //setting recommendations

          planData.setRecommendations($scope.recommendations);

          //If user not logged in when questionnaire is finished, signup modal (which also contains the login button) will pop up

          if (!$scope.isLoggedIn()) {
              self.signup();

          //If user is logged in when questionnaire is finished, push trip id to user, push user as traveler to trip and then redirect to recommendations

          } else {

              $http.put('/api/users/' + $scope.currentUser._id, {
                  tripId: trip._id
              }).success(function(updatedUser) {
                  $http.put('/api/trips/'+planData.getTripIdReminder(), {travelerId: updatedUser._id}).success(function(trip) {

                    //now trip and user both updated, redirect to recommendations.
                    //redirect to recommendations

                    if (planData.getTempActivity() !== undefined) {

                        console.log('hit if statement for temp activity!!!!!!')
                        //If there is a tempActivity, that means a brand new user tried to add a new activity from the map view without creating a new account
                        var tempActivity = planData.getTempActivity();
                        var title = tempActivity.name;
                        var googleDetails = tempActivity;
                        var location = {
                          address: tempActivity.formatted_address,
                          coords: {
                            latitude: tempActivity.geometry.location.k,
                            longitude: tempActivity.geometry.location.B
                          }
                        };
                        var cost = tempActivity.price_level;

                        $http.put('/api/trips/wishlist/'+trip._id, {
                            title: title,
                            googleDetails: googleDetails,
                            location: location,
                            cost: cost || 9
                          }).success(function(tripWithStashedActivity) {
                              $location.path('/recommend/' + trip._id);
                              $rootScope.$broadcast('clear temp activity');
                          });
                    } else {
                      console.log("hit else statement instead");
                      $location.path('/recommend/' + trip._id);
                    }
                  });
              });
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
