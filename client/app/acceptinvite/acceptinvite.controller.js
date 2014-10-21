'use strict';

angular.module('tripPlannerApp')
  .controller('AcceptinviteCtrl', function ($scope, $cookies, $stateParams, planData) {
    var tripId = $stateParams.id;
    var token = $stateParams.token;

    planData.setAcceptTripUser({tripId: tripId, token: token});
  });
