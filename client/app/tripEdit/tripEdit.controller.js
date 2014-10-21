'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData, $stateParams, $interval) {
    var tripId = $stateParams.id;

  	$scope.currentTrip = planData.getCurrentTrip();
    if(!planData.getCurrentTrip()) {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        $scope.currentTrip = trip;
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
      $scope.currentWish = $scope.currentTrip.wishlist[index];
      $scope.currentWish.index = index; // This variable is so that we can remove
      // the wish from the array once it is added to the calendar
      console.log($scope.currentWish);
    }

    $scope.autocomplete = {
      options:{}
    };

    $scope.addToWishlist = function() {
      var checkForDetails = $interval(function() {
          if ($scope.autocomplete.details !== undefined) {
              $interval.cancel(checkForDetails);
              var activity = {
                title:$scope.autocomplete.details.name,
                googleDetails: $scope.autocomplete.details,
                location: {
                  address: $scope.autocomplete.details.formatted_address,
                  coords: {
                    latitude: $scope.autocomplete.details.geometry.location.k,
                    longitude: $scope.autocomplete.details.geometry.location.B
                  }
                }
              };
              $scope.currentTrip.wishlist.push(activity);
              $scope.autocomplete.details = undefined;
          }
      }, 50, 10);
    };

    $scope.currentWish;
    $scope.start;
    $scope.selectActivityTime = function() {
      // pop up date and time selector
      if($scope.start !== undefined) {
        $scope.addToCal();
      }
    }

    $scope.addToCal = function() {
      console.log("scope.currentWish", $scope.currentWish);
      // push into trip schema
      $http.put('/api/trips/' + $scope.currentTrip._id + '/addActivity', {
        title: $scope.currentWish.title,
        name: $scope.currentWish.title,
        googleDetails: $scope.currentWish.googleDetails,
        location: {
          address: $scope.currentWish.location.address,
          coords: {
            latitude: $scope.currentWish.location.coords.latitude,
            longitude: $scope.currentWish.location.coords.longitude
          }
        },
        start: $scope.start
      })
      .success(function(data){
        // This will now remove the wish from the wishlist in the database
        // and update the scope wishlist
        $http.post('/api/trips/wishlist/' + $scope.currentTrip._id, {
          wish: $scope.currentWish
        }).success(function(data) {
          $scope.currentTrip.wishlist = data.wishlist;
        })
        $scope.closed = true;
        $rootScope.$broadcast('addToCal');
      })
      // push into event array from plan data factory
    }
  })
  // .contoller('PickerCtrl', function() {})
  ;
