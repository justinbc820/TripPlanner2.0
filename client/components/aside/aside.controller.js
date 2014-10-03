'use strict';

angular.module('tripPlannerApp')
  .controller('AsideCtrl', function ($scope, $aside, $location) {
  	this.views = {
  		map: {
  			'text': 'MAP',
  			'link': '/map'
  		},
  		dashboard: {
  			'text': 'DASHBOARD',
  			'link': '/dashboard'
  		},
  		login: {
  			'text': 'LOGIN',
  			'link': '/settings'
  		},
  		settings: {
  			'text': 'SETTINGS',
  			'link': '/newtrip'
  		},
  		signup: {
  			'text': 'SIGNUP',
  			'link': '/signup'
  		},
  		admin: {
  			'text': 'ADMIN',
  			'link': '/admin'
  		},
  		main: {
  			'text': 'MAIN',
  			'link': '/main'
  		},
  		newTrip: {
  			'text': 'NEW TRIP',
  			'link': '/newtrip'
  		},
  		plan: {
  			'text': 'PLAN',
  			'link': '/plan'
  		}
  	}

  	this.reroute = function(newPath) {
  		$location.path(newPath)
  	};

  });