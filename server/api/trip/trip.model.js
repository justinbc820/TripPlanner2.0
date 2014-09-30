'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: String,
  days: [DaySchema],
  travelers: [{ type: Schema.Types.ObjectId, ref:"User" }],
  invitees: [{ type: Schema.Types.ObjectId, ref:"User" }],
  budget: Number,
  questionare: {}
});

var DaySchema = new Schema({
  date: Date,
  activities: [AcititySchema]
});

var AcititySchema = new Schema({
  name: String,
  location: {
    address: String,
    coords: {
      latitude: Number,
      longitude: Number
    }
  },
  description: String,
  time: Date,
  cost: Number
});

module.exports = mongoose.model('Trip', TripSchema);