/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Trip = require('./trip.model');

exports.register = function(socket) {
  Trip.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Trip.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('trip:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('trip:remove', doc);
}