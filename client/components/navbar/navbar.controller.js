'use strict';

angular.module('tripPlannerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, ngDialog) {
    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    this.isActive = function(route) {
      return route === $location.path();
    };

    this.signup = function() {
      ngDialog.open({template: 'signup.html', controller: 'SignupCtrl'});
    };
  });