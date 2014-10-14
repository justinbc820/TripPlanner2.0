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
        var address = gDetails[0].formatted_address;
        var latitude = gDetails[0].geometry.location.k;
        var longitude = gDetails[0].geometry.location.B;
        // var location = new google.maps.LatLng(latitude, longitude);
        var cost = gDetails[0].price_level || 9; // 9 means undefined price
        var googleDetails = gDetails[0];

        $http.put('/api/trips/wishlist/'+tripId, {
          title:title,
          address:address,
          latitude:latitude,
          longitude:longitude,
          // location:location,
          cost:cost,
          googleDetails:googleDetails
        }).success(function(trip) {
          planData.setCurrentTrip(trip);
        })
      });
    }; //end to addToWishList

    $scope.goToDashboard = function() {
      $location.path('/dashboard/'+tripId);
    };
  });
