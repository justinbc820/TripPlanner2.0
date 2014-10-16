'use strict';

angular.module('tripPlannerApp')

.factory('planData', function($http, $rootScope, Auth, $location) {
var isLoggedIn = Auth.isLoggedIn;
var currentTrip; // this represents ALL information about the currently selected global trip
var user; // this represents information about the user, such as their id, etc.

var currDetails;

// Gets information about the user from the database
var fetchUserFromDB = function() {
    return $http.get('/api/users/me')
        .success(function(user) {
            if (user) {
                user = user;
            }
            // if the user only has one trip, make that the current Trip, otherwise,
            // pop up a modal to have them select the current trip.
            if (user.trips.length === 1) {
                setCurrentTrip(user.trips[0]);
            } else {
                showSelectTripModal();
            }
        })
};

// calls the above function when the app loads
fetchUserFromDB();

var recommendations = {}; // This object contains recommendations for the recommendations view

// var selectTripModal = $modal({title: 'SELECT A TRIP', template: '../mapOverlay/tripPicker.html', show: false, placement: 'center'});

var showSelectTripModal = function() {
    // ngDialog.open({template: 'chooseTrip.html', controller:'DashboardCtrl'});
    // selectTripModal.show();
    $rootScope.$broadcast('showSelectTripModal');
};

// This variable houses LatLng and zoom specifications for initial map load and then
// every time the map viewport is changed.
var currentMapOpts = {
    location: {
        k: 37.579413,
        B: -2.900391
    },
    zoom: 3,
    bounds: {}
};


var tripreminder = {}; // This caches the trip in case the person tries to add a trip, but isn't logged in or signed up

// var currentSearch = {searchResults:[]};

/*
 * This function sets the current trip when someone selects it from dashboard
 * Also, sets all search options to be in relation to the trip's LatLng
 */
var setCurrentTrip = function(trip) {
    currentTrip = trip;
    currentMapOpts.location = trip.latLng;
    currentMapOpts.zoom = 8;
    $rootScope.$broadcast('newCurrentTrip');
};


// this caches the current activity just in case the user wasn't logged in or
// didn't have a trip selected when they clicked on add to trip.
// It is then fetched from the dashboard controller once they are logged in or they
// have a current trip selected.
var tempActivityDetailsObj;

$rootScope.$on('clear temp activity', function() {
    tempActivityDetailsObj = {};
});

//Clears all factories on log out to avoid populated factories if someone logs back in without page refresh

$rootScope.$on('logout', function() {
    tripreminder = {};
    tempActivityDetailsObj = undefined;
    currentTrip = undefined;
    currentMapOpts = {
        location: {
            k: 37.579413,
            B: -2.900391
        },
        zoom: 3
    };
    user = undefined;
});


// Public API here
var factoryObj = {

    // This fetches the cached activity for when a person wasn't logged in or didnt
    // have a trip selected
    getTempActivity: function() {
        return tempActivityDetailsObj;
    },

    setCurrDetails: function(details) {
      currDetails = details;
    },

    getCurrDetails: function() {
      return currDetails;
    },

    // This is a function that was housed outside the return object because other
    // functions within the object needed access to it
    setCurrentTrip: setCurrentTrip,

    getCurrentTrip: function() {
        return currentTrip;
    },

    setMapOpts: function(coords, zoom, bounds) {
        currentMapOpts.location = coords;
        currentMapOpts.zoom = zoom;
        currentMapOpts.bounds = bounds;
        $rootScope.$broadcast('newMapOpts');
    },

    getMapOpts: function() {
        return currentMapOpts;
    },

    // These functions get and set the cached trip when a person
    setTripIdReminder: function(id) {
        delete tripreminder.tripId;
        tripreminder.tripId = id;
    },

    getTripIdReminder: function() {
        return tripreminder.tripId;
    },

    // This will add an activity to the current trip. It will check to make sure
    // that the person is logged in and has a current trip.
    addToTrip: function(obj, selectedDay) {
        console.log("this is obj", obj);
        console.log("this is selected day", selectedDay);
        //Wrapping tempActivityDetailsObj in "if" statement to prevent it from being reset when angular runs digest loop upon the trippicker modal resetting the mapOverlay controller's scope

        if (obj) {
        tempActivityDetailsObj = obj;
        console.log(tempActivityDetailsObj)
        }

        if (isLoggedIn()) {
            if (!currentTrip) {
                if (!user) {
                    fetchUserFromDB();
                } else {
                    if (user.trips.length === 1) {
                        setCurrentTrip(user.trips[0]);
                    } else {
                        $rootScope.$broadcast('showSelectTripModal');
                    }
                }
            } else {

                /*
                 * This takes an object and formats it for the server-side mongoose model
                 * It then writes the formatted activity to the currently selected day
                 */

                var tripId = currentTrip._id;
                if (!selectedDay) {
                    console.log('no selected day');
                    $http.put('/api/trips/wishlist/' + tripId, {
                        title: tempActivityDetailsObj.title,
                        location: {
                            address: tempActivityDetailsObj.formatted_address,
                            coords: {
                                latitude: tempActivityDetailsObj.geometry.location.k,
                                longitude: tempActivityDetailsObj.geometry.location.B
                            }
                        },
                        googleDetails: tempActivityDetailsObj
                    }).success(function(trip) {
                      console.log(trip);
                      setCurrentTrip(trip);
                    });
                } else {
                    $http.put('/api/trips/' + tripId + '/addActivity', {
                        title: tempActivityDetailsObj.title,
                        location: {
                            address: tempActivityDetailsObj.formatted_address,
                            coords: {
                                latitude: tempActivityDetailsObj.geometry.location.k,
                                longitude: tempActivityDetailsObj.geometry.location.B
                            }
                        },
                        googleDetails: tempActivityDetailsObj,
                        start: selectedDay,
                        cost: tempActivityDetailsObj.price_level || 9
                    }).success(function(trip) {
                        setCurrentTrip(trip);
                    });
                }
            }
        } else {
            $rootScope.$broadcast('showSignupModal');
        }
    },

    // This function writes all trip recommendations to the trip record in the DB
    setRecommendations: function(data) {
        recommendations.arr = data;
        $http.put('/api/trips/' + tripreminder.tripId, {
                recommendations: recommendations.arr
            })
            .success(function(tripWithRecommendations) {
                console.log("recommendations successfully saved under current trip.", tripWithRecommendations);
            });
    },

    // This function will fetch recommendations from the DB
    getRecommendations: function(tripId) {
        return $http.get('/api/trips/' + tripId)
            .success(function(trip) {
                factoryObj.recommendations = trip;
            });
    },

    /*
     * This function is called when a person completes the newTrip survey.  It takes
     * the date range, calculates the number of days between the two, makes an array
     * of that length, then pushes each intervening date into an array of dates.  This
     * data is made available to the map overlay controller to populate the day selection bar
     */
    calculateDays: function(dateRange) {
        var oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
        var startDate = dateRange.startDate._d.getTime(); //milliseconds of start
        var endDate = dateRange.endDate._d.getTime(); // millisedonds of end
        var startDay = dateRange.startDate._d.getDate(); // date of first day
        var dayDiff = Math.round(Math.abs(startDate - endDate) / oneDay); // num days between
        // start and ending dates
        var daysArray = [];

        for(var i=0; i<dayDiff; i++) {
          // start at the first day and add one day at a time and push that new date to an array
          var newDate = new Date(dateRange.startDate._d.setDate(startDay + i));
          daysArray.push(newDate);
        }
        return daysArray;
    }
};

return factoryObj;
});
