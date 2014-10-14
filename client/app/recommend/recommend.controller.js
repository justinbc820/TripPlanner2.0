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
        $scope.recommendations = data.recommendations[0].array;
        $scope.destination = data.questionnaire.location;
        // console.log("returned", data);
      });
    };

    this.redirect = function() {
      $location.path('/dashboard/' + tripId);
    };

    getRecommendations();
    $scope.transitionTo = function(e) {
      var elem = angular.element(e.srcElement);
      elem.css('background','green');
      // $scope.makeitGreen = 'makeGreen';
      // if ($scope.makeitGreen = 'makeGreen') {
      //   $scope.makeitGreen = 'makeBlack';
      // }
    }

    $scope.addToWishList = function(index, query) {
      $scope.selected[index] = true;
      ngGPlacesAPI.textSearch({
          'query': query
      })
      .then(function(gDetails) {
        console.log(gDetails);
        var title = gDetails[0].name;
        var googleDetails = gDetails[0];
        var location = {
          address: gDetails[0].formatted_address,
          coords: {
            latitude: gDetails[0].geometry.location.k,
            longitude: gDetails[0].geometry.location.B
          }
        };
        var cost = gDetails[0].price_level || 9; // 9 means undefined price

        $http.put('/api/trips/wishlist/'+ tripId, {
          title:title,
          googleDetails:googleDetails,
          location:location,
          cost:cost
        }).success(function(trip) {
          planData.setCurrentTrip(trip);
        })
      });
    }; //end to addToWishList

    $scope.goToDashboard = function() {
      $location.path('/dashboard/'+tripId);
    };
  });
