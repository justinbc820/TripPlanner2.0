'use strict';

angular.module('tripPlannerApp')
  .controller('RecommendCtrl', function ($scope, planData, $stateParams, ngGPlacesAPI, $http, $location) {
    var tripId = $stateParams.tripid;

    $scope.selected = [];
    for (var i=0; i<100; i++) {
      $scope.selected.push(false);
    }


    var getRecommendations = function() {
      planData.getRecommendations(tripId).success(function(data) {
        if(data.recommendations[0]) {
          $scope.recommendations = data.recommendations[0].array;
        } else {
          $scope.error = true;
          console.log("NO RECOMMENDATIONS")
        }
        $scope.destination = data.questionnaire.location;
      });
    };

    this.redirect = function() {
      $location.path('/dashboard/' + tripId);
    };

    getRecommendations();

    $scope.goToDashboard = function() {
      $location.path('/dashboard/'+tripId);
    };

    $scope.addToWishList = function(index, query) {
      $scope.selected[index] = true;
      ngGPlacesAPI.textSearch({
          'query': query
      })
      .then(function(gDetails) {
        var title = gDetails[0].name;
        var location = {
          address: gDetails[0].formatted_address,
          coords: {
            latitude: gDetails[0].geometry.location.k,
            longitude:gDetails[0].geometry.location.B
          }
        };
        var googleDetails = gDetails[0];

        $http.put('/api/trips/wishlist/'+tripId, {
          title:title,
          location: location,
          googleDetails:googleDetails
        }).success(function(trip) {
          planData.setCurrentTrip(trip);
        });
      });
    }; //end to addToWishList
});