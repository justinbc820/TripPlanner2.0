'use strict';

angular.module('tripPlannerApp')
  .factory('planData', function ($http, $rootScope, ngDialog) {
    var currentTrip;
    var user;

    var fetchUserFromDB = function() {
      $http.get('/api/users/me').success(function(user) {
        if(user) {
          user = user;
        }
        if(user.trips.length === 1) {
          setCurrentTrip(user.trips[0]);
        } else {
          selectTripModal();
        }
      })
    }

    var tempActivityDetailsObj;
    var selectTripModal = function() {
      ngDialog.open({template: 'chooseTrip.html', controller:'DashboardCtrl'});
    };

    var currentMapOpts = {
      location: {
        latitude:37.579413,
        longitude:-2.900391
      },
      zoom:3
    };

    var trip = {};

    var currentSearch = {searchResults:[]};

    var recommendations = {};

    var setCurrentTrip = function(trip) {
      currentTrip = trip;
      $rootScope.$broadcast('newCurrentTrip');
    };

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

    // Public API here
    return {
      getTempActivity: function() {
        return tempActivityDetailsObj;
      },

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

      setTrip: function(id) {
        trip.tripId = id;
      },

      getTrip: function() {
        return trip.tripId;
      },

      addToTrip: function(obj) {
        tempActivityDetailsObj = obj;
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
      },

      setRecommendations: function(data) {
        recommendations.arr = data;
      },

      getRecommendations: function() {
        console.log(recommendations.arr);
        return recommendations.arr;
      }
    };
  });
