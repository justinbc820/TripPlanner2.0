'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tripEdit', {
        url: '/dashboard/:id',
        templateUrl: 'app/tripEdit/tripEdit.html',
        controller: 'TripeditCtrl',
        isPublic: false
      });
  });