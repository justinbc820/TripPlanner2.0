'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: { type: String, default: ""},
  activities: [ActivitySchema],
  travelers: [{ type: Schema.Types.ObjectId, ref:"User" }],
  invitees: [{ type: Schema.Types.ObjectId, ref:"User" }],
  budget: { type: Number, default: 0},
  questionnaire: {},
  wishlist: [ActivitySchema],
  days:[],
  recommendations: []
});

// var DaySchema = new Schema({
//   date: Date,
//   activities: [ActivitySchema]
// });

var ActivitySchema = new Schema({
  title: String,
  location: {
    address: String,
    coords: {
      latitude: Number,
      longitude: Number
    }
  },
  description: String,
  details: {},
  start: Date,
  end: Date,
  cost: Number
});

module.exports = mongoose.model('Trip', TripSchema);