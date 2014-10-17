'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {

    $scope.userData;

    $scope.placePhotos = [];

    var getPlacePhotos = function(tripsArray) {
        $http.post('/api/getrecommendations/placePhoto', {
            tripsArray:tripsArray
        })
        .success(function(photosObject) {
            console.log(photosObject)
            for(var i=0; i<tripsArray.length; i++) {
                $scope.placePhotos.push(photosObject.photosObject[tripsArray[i].questionnaire.location])
            }
        });
    }



    $http.get('/api/users/me').success(function(user) {
        $scope.userData = user;
        getPlacePhotos($scope.userData.trips);
        if(planData.getCurrentTrip()) {
            var tripId = planData.getCurrentTrip()._id;
            $http.get('/api/trips/' + tripId).success(function(trip) {
                planData.setCurrentTrip(trip);
                // $location.path('/dashboard/' + trip._id);
            })
        }
    });

    $scope.setCurrentTrip = function(trip) {
        trip.wishlist.push(planData.getTempActivity());
        planData.setCurrentTrip(trip);
    };

    this.tripEditView = function(index) {
        var tripId = $scope.userData.trips[index]._id;
        $http.get('/api/trips/' + tripId).success(function(trip) {
            planData.setCurrentTrip(trip);
            $location.path('/dashboard/' + trip._id);
        })
        // $location.path('/dashboard/' + planData.getCurrentTrip()._id)
        $location.path('/dashboard/' + tripId)
    };

    this.createTrip = function() {
        $location.path('/newtrip');
    };
  });


