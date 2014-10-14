'use strict';

angular.module('tripPlannerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $modal) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;



    if (this.isLoggedIn()) {
      $scope.logoRedirect = {url: '/dashboard'};
    } else {
      $scope.logoRedirect = {url: '/'};
    }

    $scope.$on('loggedIn', function() {
      $scope.logoRedirect.url = '/dashboard';
      loginModal.$promise.then(loginModal.hide);
    });

    $scope.$on('logout', function() {
      $scope.logoRedirect.url = '/';
    })

    var signUpModal = $modal({title: 'CREATE AN ACCOUNT', template: 'app/account/signup/signup.html', show: false, placement: 'center'});

    var loginModal = $modal({title: 'LOGIN', template: 'app/account/login/login.html', show: false, placement: 'center'});

    $scope.$on('signedUp', function() {
      $scope.logoRedirect.url = '/dashboard';
      signUpModal.$promise.then(signUpModal.hide);
    });


    $scope.$on('closeSignupModalAndDisplayLogin', function() {
      signUpModal.$promise.then(signUpModal.hide);
      loginModal.show();
    });

    $scope.$on('closeLoginModalAndDisplaySignup', function() {
      loginModal.$promise.then(loginModal.hide);
      signUpModal.show();
    });

    $scope.$on('showSignupModal', function() {
      signUpModal.$promise.then(signUpModal.show);
    });

    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    this.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    this.isActive = function(route) {
      return route === $location.path();
    };

    this.signup = function() {
      signUpModal.show();
    };

    this.login = function() {
      loginModal.show();
    }
  });