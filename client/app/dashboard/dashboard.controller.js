'use strict';

angular.module('tripPlannerApp')
  .controller('DashboardCtrl', function ($scope, Auth) {
    this.getCurrentUser = Auth.getCurrentUser;
    this.userData = this.getCurrentUser();
    console.log('User data', this.userData);
  });
