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
  var userId = req.body.userId;
  var questionnaire = req.body.questionnaire;
  Trip.create({travelers: [], questionnaire: questionnaire}, function(err, trip) {
    if(err) { return handleError(res, err); }
    trip.travelers.push(userId);
    trip.save(function(err) {
      return res.json(201, trip);
    });
  });
};

// Updates an existing trip in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Trip.findById(req.params.id, function (err, trip) {
    if (err) { return handleError(res, err); }
    if(!trip) { return res.send(404); }
    var updated = _.merge(trip, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, trip);
    });
  });
};

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