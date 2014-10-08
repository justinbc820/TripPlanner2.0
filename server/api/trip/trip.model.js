'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: { type: String, default: ""},
  days: [DaySchema],
  travelers: [{ type: Schema.Types.ObjectId, ref:"User" }],
  invitees: [{ type: Schema.Types.ObjectId, ref:"User" }],
  budget: { type: Number, default: 0},
  questionnaire: {},
  wishlist: [ActivitySchema]
});

var DaySchema = new Schema({
  date: Date,
  activities: [ActivitySchema]
});

var ActivitySchema = new Schema({
  activityObj: {}
  // name: String,
  // location: {
  //   address: String,
  //   coords: {
  //     latitude: Number,
  //     longitude: Number
  //   }
  // },
  // description: String,
  // time: Date,
  // cost: Number
});

module.exports = mongoose.model('Trip', TripSchema);