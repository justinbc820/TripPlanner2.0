'use strict';

var _ = require('lodash');
var Trip = require('./trip.model');

// Get list of trips
exports.index = function(req, res) {
  Trip.find(function (err, trips) {
    if(err) { return handleError(res, err); }
    return res.json(200, trips);
  });
};

// Get a single trip
exports.show = function(req, res) {
  Trip.findById(req.params.id, function (err, trip) {
    if(err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }
    return res.json(trip);
  });
};

// Creates a new trip in the DB.
exports.create = function(req, res) {
  // var userId = req.body.userId;
  var questionnaire = req.body.questionnaire;
  var days = req.body.days;
  var latLng = req.body.latLng;
  Trip.create({ questionnaire: questionnaire, days: days, latLng:latLng }, function(err, trip) {
    if(err) { return handleError(res, err); }
    return res.json(201, trip);
  });
};

// Updates an existing trip in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Trip.findById(req.params.id, function (err, trip) {
    if (err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }
    if (req.body.travelerId) {
      trip.travelers.push(req.body.travelerId);
    } else if (req.body.recommendations) {
      trip.recommendations.push(req.body.recommendations);
    } else {
      var trip = _.merge(trip, req.body);
    }
    trip.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, trip);
    });
  });
};

// Updates an existing trip in the DB.
exports.addToWishlist = function(req, res) {
  Trip.findById(req.params.id, function (err, trip) {
    if (err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }

    var activity = {
      title: req.body.title,
      googleDetails: req.body.googleDetails,
      location: {
        address: req.body.location.address,
        coords: {
          latitude: req.body.location.coords.latitude,
          longitude: req.body.location.coords.longitude
        }
      },
      // description: null,
      start: null,
      cost: req.body.cost
    };

    trip.wishlist.push(activity);
    console.log("trip wishlist ", trip.wishlist)

    trip.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, trip);
    });
  });
};

// Removes wishlist item
exports.removeFromWishlist = function(req, res) {
  Trip.findById(req.params.id, function (err, trip) {
    if (err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }

    var index = req.body.wish.index;

    trip.wishlist.splice(index,1);

    trip.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, trip);
    });
  });
};

// push wish into trip activity aray
exports.addActivity = function(req, res) {
  Trip.findById(req.params.id, function(err, trip) {
    if (err) { return handleError(res, err); }

    var activity = req.body;

    trip.activities.push(activity);

    trip.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, trip);
    });
  });
};

// // Updates an existing trip in the DB.
// exports.addDetails = function(req, res) {
//   Trip.findById(req.params.id, function (err, trip) {
//     if (err) { return handleError(res, err); }
//     if(!trip) { return res.send(404); }

//     var activity = {
//       name: req.body.name,
//       location: {
//         address: req.body.address,
//         coords: {
//           latitude: req.body.latitude,
//           longitude: req.body.longitude
//         }
//       },
//       description: null,
//       time: null,
//       cost: req.body.cost
//     };

//     trip.wishlist.push(activity);

//     trip.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, trip);
//     });
//   });
// };

// Deletes a trip from the DB.
exports.destroy = function(req, res) {
  Trip.findById(req.params.id, function (err, trip) {
    if(err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }
    trip.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}