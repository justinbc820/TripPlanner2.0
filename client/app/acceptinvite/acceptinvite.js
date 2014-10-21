'use strict';

angular.module('tripPlannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('acceptinvite', {
        url: '/acceptinvite/:id/:token',
        templateUrl: 'app/acceptinvite/acceptinvite.html',
        controller: 'AcceptinviteCtrl as acceptinvite',
        isPublic: true
      });
  });