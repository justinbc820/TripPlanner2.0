'use strict';

angular.module('tripPlannerApp')
  .controller('AsideCtrl', function ($scope, $aside, $location) {
  	this.views = {
  		map: {
  			'text': 'Map',
  			'link': '/map'
  		},
  		dashboard: {
  			'text': 'Dashboard',
  			'link': '/dashboard'
  		},
  		account: {
  			'text': 'Account',
  			'link': '/settings'
  		},
  		newTrip: {
  			'text': 'New Trip',
  			'link': '/newtrip'
  		},
  		logout: {
  			'text': 'Logout',
  			'link': '#'
  		}
  	}

  	this.reroute = function(newPath) {
  		console.log(newPath);
  		$location.path(newPath)
  	};

  });