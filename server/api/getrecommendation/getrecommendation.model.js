'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GetrecommendationSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Getrecommendation', GetrecommendationSchema);