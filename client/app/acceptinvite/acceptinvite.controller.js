'use strict';

angular.module('tripPlannerApp')
  .controller('AcceptinviteCtrl', function ($scope, $cookies, $stateParams, planData) {
    var groupId = $stateParams.id;

    planData.setAcceptTripId(groupId);

  });
