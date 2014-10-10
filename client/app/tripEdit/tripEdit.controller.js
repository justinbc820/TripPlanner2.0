'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData, $stateParams, $interval) {
    var tripId = $stateParams.id;

  	$scope.currentTrip = planData.getCurrentTrip();
    if(!planData.getCurrentTrip()) {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        $scope.currentTrip = trip;
      })
    }

    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
    	console.log($scope.currentTrip);
    });

    $scope.updateTrip = function(updatedTrip) {
      if($scope.currentTrip) {
      	$http.put('/api/trips/' + $scope.currentTrip._id, {
      		// Send trip to backend, update with newly changed trip
      	})
      }
    };

    $scope.$watch('currentTrip', function(newVal, oldVal) {
    	$scope.updateTrip(newVal);
    }, true);

    $scope.closed = true;

    $scope.showDatePicker = function(index) {
      $scope.closed = !$scope.closed;
      $scope.currentWish = $scope.currentTrip.wishlist[index]
    }

    $scope.autocomplete = {};

    $scope.addToWishlist = function() {
      var checkForDetails = $interval(function() {
          if ($scope.autocomplete.details !== undefined) {
              $interval.cancel(checkForDetails);
              $scope.currentTrip.wishlist.push($scope.autocomplete.details);
              console.log("details: ", $scope.autocomplete.details)
              $scope.autocomplete.details = undefined;
          }
      }, 50, 10);
    };


    $scope.currentWish;
    $scope.start;
    $scope.selectActivityTime = function() {
      // pop up date and time selector
      if($scope.start !== undefined) {
        console.log('This is the wish thats been clicked: ', $scope.start);
        console.log('wish: ', $scope.currentWish);
        // $scope.addToCal($scope.wish);
      }
    }

    $scope.addToCal = function() {
      // push into trip schema
      // push into event array from plan data factory
    }
  })
  // .contoller('PickerCtrl', function() {})
  ;
