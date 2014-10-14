'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData, $stateParams, $interval) {
    var tripId = $stateParams.id;

  	$scope.currentTrip = planData.getCurrentTrip();
    if(!planData.getCurrentTrip()) {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        $scope.currentTrip = trip;
        console.log($scope.currentTrip);
        // $scope.autocomplete.options.bounds = new google.maps.LatLngBounds(
        //   $scope.currentTrip.latLng.k,
        //   $scope.currentTrip.latLng.B
        // );

        planData.setCurrentTrip(trip);
      })
    }

    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
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
      console.log("currentTrip", $scope.currentTrip.wishlist)
      $scope.currentWish = $scope.currentTrip.wishlist[index];
      console.log("currentWish", $scope.currentWish);
    }

    $scope.autocomplete = {
      options:{}
    };

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
        console.log('wish: ', $scope.currentWish);
        console.log('Time selected for wish: ', $scope.start);
        $scope.addToCal();
      }
    }

    $scope.addToCal = function() {
      // push into trip schema
      $http.put('/api/trips/' + $scope.currentTrip._id + '/addActivity', {
        title: $scope.currentWish.title, 
        googleDetails: $scope.currentWish, 
        location: {
          address: $scope.currentWish.location.address,
          coords: {
            latitude: $scope.currentWish.location.coords.latitude,
            longitude: $scope.currentWish.location.coords.longitude
          }
        },
        start: $scope.start,
        cost: $scope.currentWish.cost
      })
      .success(function(data){
        console.log("wish saved to the server: ", $scope.currentTrip);
        $scope.closed = true;
        $rootScope.$broadcast('addToCal');
      })
      // push into event array from plan data factory
    }
  })
  // .contoller('PickerCtrl', function() {})
  ;
