'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: { type: String, default: ""},
  activities: [],
  travelers: [{ type: Schema.Types.ObjectId, ref:"User" }],
  invitees: [],
  budget: { type: Number, default: 0},
  questionnaire: {},
  wishlist: [ActivitySchema],
  days:[],
  recommendations: [],
  latLng:{}
});

// var DaySchema = new Schema({
//   date: Date,
//   activities: [ActivitySchema]
// });

var ActivitySchema = new Schema({
  title: String,
  googleDetails: {},
  location: {
    address: String,
    coords: {
      latitude: Number,
      longitude: Number
    }
  },
  start: Date
});

module.exports = mongoose.model('Trip', TripSchema);