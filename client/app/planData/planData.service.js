'use strict';

angular.module('tripPlannerApp')

  .factory('planData', function ($http, $rootScope, ngDialog, Auth, $location) {
    var isLoggedIn = Auth.isLoggedIn;
    var currentTrip; // this represents ALL information about the currently selected global trip
    var user; // this represents information about the user, such as their id, etc.

    // Gets information about the user from the database
    var fetchUserFromDB = function() {
      return $http.get('/api/users/me')
        .success(function(user) {
          if(user) {
            user = user;
          }
          // if the user only has one trip, make that the current Trip, otherwise,
          // pop up a modal to have them select the current trip.
          if(user.trips.length === 1) {
            setCurrentTrip(user.trips[0]);
          } else {
            selectTripModal();
          }
        })
    };

    // calls the above function when the app loads
    fetchUserFromDB();

    var recommendations = {}; // This object contains recommendations for the recommendations view

    // This function is called when someone doesn't have a current trip and need to select one
    var selectTripModal = function() {
      ngDialog.open({template: 'chooseTrip.html', controller:'DashboardCtrl'});
    };

    // This variable houses LatLng and zoom specifications for initial map load and then
    // every time the map viewport is changed.
    var currentMapOpts = {
      location: {
        k:37.579413,
        B:-2.900391
      },
      zoom:3
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
      currentMapOpts.zoom = 7;
      $rootScope.$broadcast('newCurrentTrip');
    };

    /*
     * This takes an object and formats it for the server-side mongoose model
     * It then writes the formatted trip to the DB
    */
    var pushTripToDB = function(obj) {
      var tripId = currentTrip._id;
      var name = obj.name;
      var address = obj.formatted_address;
      var latitude = obj.geometry.location.k;
      var longitude = obj.geometry.location.B;
      var cost = obj.price_level || 9; // 9 means undefined price
      var details = obj;
      $http.put('/api/trips/wishlist/' + tripId, {
        name:name,
        address:address,
        latitude:latitude,
        longitude:longitude,
        cost:cost,
        details:details
      }).success(function(trip) {
        console.log("new trip from DB ", trip);
      })
    };

    // this caches the current activity just in case the user wasn't logged in or 
    // didn't have a trip selected when they clicked on add to trip.
    // It is then fetched from the dashboard controller once they are logged in or they
    // have a current trip selected.
    var tempActivityDetailsObj; 


    // Public API here
    var factoryObj = {

      // This fetches the cached activity for when a person wasn't logged in or didnt
      // have a trip selected
      getTempActivity: function() {
        return tempActivityDetailsObj;
      },

      // This is a function that was housed outside the return object because other
      // functions within the object needed access to it
      setCurrentTrip: setCurrentTrip, 

      getCurrentTrip: function() {
        return currentTrip;
      },

      setMapOpts: function(coords, zoom) {
        currentMapOpts.location = coords;
        currentMapOpts.zoom = zoom;
      },

      getMapOpts: function() {
        return currentMapOpts;
      },

      // These functions get and set the cached trip when a person
      setTripIdReminder: function(id) {
        tripreminder.tripId = id;
      },

      getTripIdReminder: function() {
        return tripreminder.tripId;
      },

      // This will add an activity to the current trip. It will check to make sure
      // that the person is logged in and has a current trip.
      addToTrip: function(obj) {
        console.log(obj);
        tempActivityDetailsObj = obj;
        if(isLoggedIn()) {
          if(!currentTrip) {
            if(!user) {
              fetchUserFromDB();
            } else {
              if(user.trips.length === 1) {
                setCurrentTrip(user.trips[0])
              } else {
                selectTripModal();
              }
            }
          } else {
            pushTripToDB(obj);
          }
        } else {
          $location.path('/login');
        }
      },

      // This function writes all trip recommendations to the trip record in the DB
      setRecommendations: function(data) {
        recommendations.arr = data;
        $http.put('/api/trips/'+tripreminder.tripId, {recommendations: recommendations.arr})
          .success(function(tripWithRecommendations) {
            console.log("recommendations successfully saved under current trip.", tripWithRecommendations);
          });
      },

      // This function will fetch recommendations from the DB
      getRecommendations: function(tripId) {
        return $http.get('/api/trips/'+tripId)
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
        var oneDay = 24*60*60*1000; // Number of milliseconds in one day
        var startDate = dateRange.startDate._d.getTime(); //milliseconds of start
        var endDate = dateRange.endDate._d.getTime(); // millisedonds of end
        var startDay = dateRange.startDate._d.getDate(); // date of first day
        var dayDiff = Math.round(Math.abs(startDate - endDate)/oneDay); // num days between
        // start and ending dates
        var daysArray = [];
        for(var i=0; i<dayDiff; i++) {
          // start at the first day and add one day at a time and push that new date to an array
          var newDate = new Date(dateRange.startDate._d.setDate(startDay + i)).setHours(9); 
          daysArray.push(newDate);
        }
        return daysArray;
      }
    };

    return factoryObj;
});
