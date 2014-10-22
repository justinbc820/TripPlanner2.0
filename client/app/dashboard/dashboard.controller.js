'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth, $http, planData, $location) {

    $scope.userData;

    $scope.setCurrentTrip = planData.setCurrentTrip;

    $scope.placePhotos = [];

    var getPlacePhotos = function(tripsArray) {
        $http.post('/api/getrecommendations/placePhoto', {
            tripsArray:tripsArray
        })
        .success(function(photosObject) {
            for(var i=0; i<tripsArray.length; i++) {
                $scope.placePhotos.push(photosObject.photosObject[tripsArray[i].questionnaire.location])
            }
        });
    }


    var getTrips = function() {
        $http.get('/api/users/me').success(function(user) {
            $scope.userData = user;
            $scope.populateDays();
            getPlacePhotos($scope.userData.trips);
            if(planData.getCurrentTrip()) {
                var tripId = planData.getCurrentTrip()._id;
                $http.get('/api/trips/' + tripId).success(function(trip) {
                    planData.setCurrentTrip(trip);
                    // $location.path('/dashboard/' + trip._id);
                })
            }
        });
    };

    getTrips();

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

    $scope.populateDays = function() {
        for(var i=0, n=$scope.userData.trips.length; i<n; i++) {
            var dayActivities = {};
            for(var j=0, m=$scope.userData.trips[i].days.length; j<m; j++) {
                dayActivities[$scope.userData.trips[i].days[j].slice(0,10)] = []
            }
            for(var k=0, o=$scope.userData.trips[i].activities.length; k<o; k++) {
                var day = $scope.userData.trips[i].activities[k].start.slice(0,10);
                dayActivities[day] = dayActivities[day] || [];
                dayActivities[day].push($scope.userData.trips[i].activities[k]);
            }
            $scope.userData.trips[i].dashboardActivities = dayActivities;
        }
        console.log("$scope.userData", $scope.userData);
    };

    $scope.deleteTrip = function(trip) {
      swal({
        title: "Are you sure?",
        text: "Your will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false },
        function(){
          $http.delete('/api/trips/'+trip._id).success(function(data) {
            planData.setCurrentTrip("");
            getTrips();
            swal("Deleted!", "Your trip file has been deleted.", "success");
          });
        });
    };

  });


