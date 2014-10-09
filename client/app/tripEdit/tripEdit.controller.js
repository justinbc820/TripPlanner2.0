'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData, $stateParams) {

    var tripId = $stateParams.id;
    console.log(tripId);

  	$scope.currentTrip = planData.getCurrentTrip();
    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
    	console.log($scope.currentTrip);
    });

    $scope.updateTrip = function(updatedTrip) {
    	$http.put('/api/trips/' + $scope.currentTrip._id, {
    		// Send trip to backend, update with newly changed trip
    	})
    };

    $scope.$watch('currentTrip', function(newVal, oldVal) {
    	$scope.updateTrip(newVal);
    }, true);

    $scope.closed = true;

    $scope.showDatePicker = function(index) {
      $scope.closed = !$scope.closed;
      $scope.currentWish = $scope.currentTrip.wishlist[index]
    }

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
