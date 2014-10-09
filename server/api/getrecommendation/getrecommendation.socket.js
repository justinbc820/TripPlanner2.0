/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Getrecommendation = require('./getrecommendation.model');

exports.register = function(socket) {
  Getrecommendation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Getrecommendation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('getrecommendation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('getrecommendation:remove', doc);
}