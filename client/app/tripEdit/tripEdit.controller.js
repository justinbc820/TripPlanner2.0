'use strict';

angular.module('tripPlannerApp')
  .controller('TripeditCtrl', function ($scope, $rootScope, $http, planData, $stateParams, $interval) {
    var tripId = $stateParams.id;

    // this.init = function() {
    //   $http.get('/api/trips/' + tripId).success(function(trip) {
    //     planData.setCurrentTrip(trip);
    //     $scope.currentTrip = planData.getCurrentTrip();
    //     $scope.events = $scope.currentTrip.activities;
    //     $scope.eventSources[0] = $scope.events.map(function(event) {
    //       // console.log("event start string:", event.start);
    //       // console.log("event start new date:", new Date(event.start));

    //       var start = new Date(event.start);
    //       var end = new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1));
    //       var obj = {
    //         title: event.title,
    //         start: start.toUTCString(),
    //         end: end.toUTCString(),
    //         allDay: false,
    //         id: event.googleDetails.place_id
    //       };
    //       return obj;
    //     });
    //     console.log("event sources after map, ", $scope.eventSources[0]);
    //   });
    // }

  	$scope.currentTrip = planData.getCurrentTrip();
    if(!planData.getCurrentTrip()) {
      $http.get('/api/trips/' + tripId).success(function(trip) {
        $scope.currentTrip = trip;
        planData.setCurrentTrip(trip);
      })
    }

    $rootScope.$on('newCurrentTrip', function() {
    	$scope.currentTrip = planData.getCurrentTrip();
      var bounds = new google.maps.Circle({
        center: new google.maps.LatLng($scope.currentTrip.latLng.k, $scope.currentTrip.latLng.B),
        radius: 50000
      }).getBounds();
      $scope.autocomplete.options.bounds = bounds;
    });

    $scope.closed = true;

    $scope.showDatePicker = function(index) {
      $scope.closed = !$scope.closed;
      $scope.currentWish = $scope.currentTrip.wishlist[index];
      $scope.currentWish.index = index; // This variable is so that we can remove
      // the wish from the array once it is added to the calendar
    }

    $scope.autocomplete = {
      options:{}
    };

    $scope.addToWishlist = function() {
      var checkForDetails = $interval(function() {
          if ($scope.autocomplete.details !== undefined) {
              $interval.cancel(checkForDetails);
              console.log($scope.autocomplete.details);
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

              $http.put('/api/trips/wishlist/' + tripId, activity).success(function(updatedTrip) {

                planData.setCurrentTrip(updatedTrip);
                console.log(updatedTrip);
                $scope.autocomplete.details = undefined;
                $scope.autocomplete.autocomplete = "";
                // $scope.currentTrip.wishlist.push(activity);
              })
              $scope.currentTrip.wishlist.push(activity);
          }
      }, 50, 10);

    };

    $scope.currentWish;
    $scope.start;

    $scope.$watch('start', function(oldVal, newVal) {
      if(newVal) {
        var start = $scope.start.toUTCString();
        $scope.addToCal(start);
      }
    })

    $scope.addToCal = function(start) {
      var ISOStart = new Date(start);
      var newActivity = {
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
        start: ISOStart,
        end: new Date(ISOStart.setHours(ISOStart.getHours() + 1)).toUTCString(),
        timezone:'UTC',
        allDay:false
      };
      // push into trip schema
      $http.put('/api/trips/' + $scope.currentTrip._id + '/addActivity', newActivity)
      .success(function(data){
        // This will now remove the wish from the wishlist in the database
        // and update the scope wishlist
        $http.post('/api/trips/wishlist/' + $scope.currentTrip._id, {
          wish: $scope.currentWish
        }).success(function(updatedTrip) {
          $scope.currentTrip.wishlist = data.wishlist;
          planData.setCurrentTrip(updatedTrip)
        })
        $scope.closed = true;
        $rootScope.$broadcast('addToCal');
      })
    }

    $rootScope.$on('newActivityDetails', function() {
      $scope.activityDetails = planData.getActivityDetails();
    })

    $scope.broadcastDelete = function() {
      $rootScope.$broadcast('deleteActivity', $scope.activityDetails.token);
    };

  });
