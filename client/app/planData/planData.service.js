'use strict';

angular.module('tripPlannerApp')

  .factory('planData', function ($http, $rootScope, ngDialog, Auth, $location) {
    var isLoggedIn = Auth.isLoggedIn;
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
    };

    var recommendations = {};

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

    var tripreminder = {};

    var currentSearch = {searchResults:[]};

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

    var factoryObj = {

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

      setTripIdReminder: function(id) {
        tripreminder.tripId = id;
      },

      getTripIdReminder: function() {
        return tripreminder.tripId;
      },

      addToTrip: function(obj) {
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

      setRecommendations: function(data) {
        recommendations.arr = data;
        $http.put('/api/trips/'+tripreminder.tripId, {recommendations: recommendations.arr}).success(function(tripWithRecommendations) {
          console.log("recommendations successfully saved under current trip.", tripWithRecommendations);
        });
      },
      getRecommendations: function(tripId) {
        // console.log(tripId);
        // return 4;
        return $http.get('/api/trips/'+tripId).success(function(trip) {
          factoryObj.recommendations = trip;
        });
      },
      calculateDays: function(dateRange) {
        var oneDay = 24*60*60*1000; // Number of milliseconds in one day
        var startDate = dateRange.startDate._d.getTime(); //milliseconds of start
        var endDate = dateRange.endDate._d.getTime(); // millisedonds of end
        var startDay = dateRange.startDate._d.getDate(); // date of first day
        var dayDiff = Math.round(Math.abs(startDate - endDate)/oneDay); // num days between
        // start and ending dates
        var daysArray = [];
        for(var i=0; i<dayDiff; i++) {
          var newDate = new Date(dateRange.startDate._d.setDate(startDay + i)); // start at
          // the first day and add one day at a time and push that new date to an array
          daysArray.push(newDate);
        }
        return daysArray;
      }
    };

    return factoryObj;
});
