'use strict';

angular.module('tripPlannerApp')
  .controller('AsideCtrl', function ($scope, $aside, $location) {
  	this.views = {
  		// map: {
  		// 	'text': 'MAP',
  		// 	'link': '/map'
  		// },
  		dashboard: {
  			'text': 'MANAGE TRIPS',
  			'link': '/dashboard',
        'icon': '../../assets/images/icons/airplane.png'
  		},
  		newtrip: {
  			'text': 'CREATE TRIP',
  			'link': '/newtrip',
        'icon': '../../assets/images/icons/pencil.png'
  		},
  		map: {
  			'text': 'EXPLORE',
  			'link': '/map',
        'icon': '../../assets/images/icons/compass.png'
  		},
      friends: {
        'text': 'FRIENDS',
        'link': '/friends',
        'icon': '../../assets/images/icons/person.png'
      },
      settings: {
        'text': 'SETTINGS',
        'link': '/settings',
        'icon': '../../assets/images/icons/cog.png'
      }
  	}

  	this.reroute = function(newPath) {
  		$location.path(newPath)
  	};

  });