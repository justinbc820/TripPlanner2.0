'use strict';

angular.module('tripPlannerApp')
  .controller('MapOverlayCtrl', function ($scope, planData, ngGPlacesAPI) {
  	// Sets the autocomplete box to search a location with a radius of meters
  	var currentTrip = planData.getCurrentTrip();
    var bounds = new google.maps.Circle({
    	center: new google.maps.LatLng(
    		currentTrip.location.latitude, 
    		currentTrip.location.longitude
    		),
    	radius: 2000
    })
    .getBounds();

    // this.autocomplete;

    this.toggleView = function(view) {
    	planData.toggleView(view);
    };

    this.placesSearch = function(autocomplete) {
    	console.log(autocomplete);
    	
    };

    this.searchFieldOptions = {
    	bounds: bounds
    }
  });
