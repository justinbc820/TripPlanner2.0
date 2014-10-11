'use strict';

angular.module('tripPlannerApp')
  .controller('RecommendCtrl', function ($scope, planData, $stateParams, ngGPlacesAPI, $http, $location) {
    var tripId = $stateParams.tripid;

    $scope.selected = [];
    for (var i=0; i<100; i++) {
      $scope.selected.push(false);
    }

    $scope.getOverlayStyle = function() {
      return {
       background: 'rgba(158,204,70,0.5)',
       opacity: 1
      }
    };

    var getRecommendations = function() {
      planData.getRecommendations(tripId).success(function(data) {
        $scope.recommendations = data.recommendations[0].array;
        $scope.destination = data.questionnaire.location;
        console.log("returned", data);
      });
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
      console.log("index added", $scope.selected);

      ngGPlacesAPI.textSearch({
          'query': query
      })
      .then(function(gDetails) {
        console.log(gDetails);
        var name = gDetails[0].name;
        var address = gDetails[0].formatted_address;
        var latitude = gDetails[0].geometry.location.k;
        var longitude = gDetails[0].geometry.location.B;
        var cost = gDetails[0].price_level || 9; // 9 means undefined price
        var details = gDetails[0];

        $http.put('/api/trips/wishlist/'+tripId, {
          name:name,
          address:address,
          latitude:latitude,
          longitude:longitude,
          cost:cost,
          details:details
        }).success(function(trip) {
          console.log("new trip updated wishlist", trip);
        })
      });
    }; //end to addToWishList

    $scope.goToDashboard = function() {
      $location.path('/dashboard/'+tripId);
    };
  });
