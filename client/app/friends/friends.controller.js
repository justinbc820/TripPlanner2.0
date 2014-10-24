'use strict';

angular.module('tripPlannerApp')
  .controller('FriendsCtrl', function ($scope, $timeout, Auth, planData, $http) {
    $scope.currUser = Auth.getCurrentUser();
    $scope.invitees = [];
    $scope.currEmail = {};

    $scope.addField = function() {
      $scope.invitees.push({
        email: "",
        name: ""
      });
    };

    $scope.removeField = function(index) {
      $scope.invitees.splice(index,1);
    };
    // var Invitee = function(destination, email) {
    //   return {
    //     num: $scope.invitees.length + 1,
    //     destination: destination,
    //     email: email
    //   };
    // };


    // this.addField = function(destination, email) {
    //   $scope.invitees.push(new Invitee())
    // }

    this.inviteFriends = function(form, invitees, tripId, destination) {
      console.log('ok')
      $scope.submitted = true;
      if (form.$invalid) {
        $timeout(function() {
        $scope.showError = false;
      }, 3000);
        $scope.showError = true;
      }


      if (form.$valid) {
        $http.post('/api/invites/', {tripId: tripId, inviter: $scope.currUser.name, invitees: invitees, destination: destination}).success(function(updatedTrip) {
          console.log(updatedTrip);
          planData.setCurrentTrip(updatedTrip);
          $scope.invitees.length = 0;
        });
      }
    };


  });
