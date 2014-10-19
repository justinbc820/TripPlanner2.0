'use strict';

angular.module('tripPlannerApp')
  .controller('FriendsCtrl', function ($scope, Auth, $http) {
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

    this.inviteFriends = function(invitees, tripId, destination) {
      // var invitee = new Invitee(destination, $scope.currEmail.value);
      $http.post('/api/invites/', {tripId: tripId, inviter: $scope.currUser.name, invitees: invitees, destination: destination}).success(function(data) {
        console.log(data);
      });
    };


  });
