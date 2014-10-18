'use strict';

var _ = require('lodash');
var async = require('async');
var Invite = require('./invite.model');
var Trip = require('../trip/trip.model')
var api_key = 'key-279025c2c865e645deb86460618be6c2';
var domain = 'tripmonk.co';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});



// Get list of invites
exports.index = function(req, res) {
    var inviter = req.body.inviter;
    var invitees = req.body.invitees;
    var destination = req.body.destination;
    var tripId = req.body.tripId;
    var returnArr = [];
    var url = "http://localhost:9000/acceptinvite/"+tripId;

    var sendInvite = function(friend, done) {
      var inviteTemplate = '<html><div style="text-align: center; padding: 3%; width: 100%; background-color: #161E20"><div style="width: 60%; margin: 20px auto"><img style="max-width: 100%" src="https://s3-us-west-2.amazonaws.com/jonahsbucket/tripmonk_horizontal_logo.png"></div><div><h2 style="padding: 10%; color: whitesmoke">Hi'+' '+friend.name+',<br><br><b style="color: #EFA961">'+inviter+'</b> has invited you to plan a dream holiday to <b style="color: #EFA961">'+destination+'</b> together.</h2><br><a href="'+url+'"><button style="border: 0; background: #9ECC46; width: 40%; padding: 2%; margin-top: 0; font-size: 1.2em; font-weight: bold; color: whitesmoke;">GET STARTED</button></a></div></div></html>';

      var data = {
        from: 'tripmonk <no-reply@tripmonk.co>',
        to: friend.email,
        subject: "You\'re invited!",
        body: 'text',
        html: inviteTemplate
      };

      mailgun.messages().send(data, function (error, body) {
        Trip.findById(req.body.tripId, function(err, trip) {
          trip.invitees.push(friend.email);
          trip.save(function(err, updatedTrip) {
            returnArr.push(updatedTrip);
            done();
          });
        });
      });
    };

    async.each(invitees, sendInvite, function(err) {
      return res.json(returnArr);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}