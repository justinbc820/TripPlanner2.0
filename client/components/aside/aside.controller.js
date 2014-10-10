'use strict';

angular.module('tripPlannerApp')
  .controller('AsideCtrl', function ($scope, $aside, $location, planData) {
    console.log("planData", planData.getCurrentTrip());
    var currentTrip;
    if(planData.getCurrentTrip()) {
      currentTrip = {
        text: planData.getCurrentTrip().questionnaire.location,
        link: '/dashboard/' + planData.getCurrentTrip()._id,
        icon: '../../assets/images/icons/airplane.png'
      }
    }
  	this.views = {
  		// map: {
  		// 	'text': 'MAP',
  		// 	'link': '/map'
  		// },
      currentTrip: currentTrip || undefined,
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