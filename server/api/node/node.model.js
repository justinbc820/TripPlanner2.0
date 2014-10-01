'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
  option: String,
  type: String,
  next: {type: Schema.Types.ObjectId, ref: 'Node'}
});

var NodeSchema = new Schema({
  num: Number,
  name: String,
  question: String,
  connections: [ConnectionSchema]
});

NodeSchema.methods.connect = function(option, type, node, cb) {
  this.connections.push({
    option: option,
    type: type,
    next: node._id
  });
  this.save(cb);
};

module.exports = mongoose.model('Node', NodeSchema);

