/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Node = require('../api/node/node.model');

Node.find({}).remove(function() {
  Node.create({
    num: 1,
    name: 'location',
    question: 'Where do you want to go?',
    connections: []
  }, {
    num: 2,
    name: 'startdate',
    question: 'When do you want to go?',
    connections: []
  }, {
    num: 3,
    name: 'duration',
    question: 'How long are you planning to go for?',
    connections: []
  }, {
    num: 4,
    name: 'tripType',
    question: 'What are you going on this trip for?',
    connections: []
  }, {
    num: 5,
    name: 'pax',
    question: 'How many people are going?',
    connections: []
  }, {
    num: 6,
    name: 'isSharing',
    question: 'Is everyone going to be sharing the cost of the trip?',
    connections: []
  }, {
    num: 7,
    name: 'singleBudget',
    question: 'What is your budget?',
    connections: []
  }, {
    num: 8,
    name: 'groupShareBudget',
    question: 'What is each person\'s budget?',
    connections: []
  }, {
    num: 9,
    name: 'groupSingleBudget',
    question: 'What is the trip budget?',
    connections: []
  }, {
    num: 10,
    name: 'groupHaveTravelArrangements',
    question: 'Does your party already have travel arrangements?',
    connections: []
  }, {
    num: 11,
    name: 'groupFlightDetails',
    question: 'What are your flight details?',
    connections: []
  }, {
    num: 12,
    name: 'separateOrTogether',
    question: 'Will the members of your party be travelling together or separately?',
    connections: []
  }, {
    num: 13,
    name: 'singleHaveTravelArrangements',
    question: 'Do you already have travel arrangements?',
    connections: []
  }, {
    num: 14,
    name: 'singleFlightDetails',
    question: 'What are your flight details?',
    connections: []
  }, {
    num: 15,
    name: 'haveAccommodation',
    question: 'Do you have a place to stay?',
    connections: []
  }, {
    num: 16,
    name: 'accommodationAddress',
    question: 'Where are you staying?',
    connections: []
  }, {
    num: 17,
    name: 'complete',
    question: 'Done!',
    connections: []
  }, function(err, data) {
      Node.find({}, function(err, data) {
        var nodes = data;
        var compare = function(node1, node2) {
          if (node1.num < node2.num) return -1;
          if (node1.num > node2.num) return 1;
        };
        nodes = nodes.sort(compare);
        nodes[0].connect(null, "otherwise", nodes[1]);
        nodes[1].connect(null, "otherwise", nodes[2]);
        nodes[2].connect(null, "otherwise", nodes[3]);
        nodes[3].connect(null, "otherwise", nodes[4]);
        nodes[4].connect("I am travelling alone", "normal", nodes[6]);
        nodes[4].connect(null, "otherwise", nodes[5]);
        nodes[5].connect("The cost will be shared", "normal", nodes[7]);
        nodes[5].connect("One person will be paying", "normal", nodes[8]);
        nodes[7].connect(null, "otherwise", nodes[9]);
        nodes[8].connect(null, "otherwise", nodes[9]);
        nodes[9].connect("Yes", "normal", nodes[10]);
        nodes[9].connect("No", "normal", nodes[11]);
        nodes[10].connect(null, "otherwise", nodes[11]);
        nodes[11].connect("We will be travelling together", "normal", nodes[14]);
        nodes[11].connect("We will be travelling separately", "normal", nodes[14]);
        nodes[6].connect(null, "otherwise", nodes[12]);
        nodes[12].connect("Yes", "normal", nodes[13]);
        nodes[12].connect("No", "normal", nodes[14]);
        nodes[13].connect(null, "otherwise", nodes[14]);
        nodes[14].connect("Yes", "normal", nodes[15]);
        nodes[14].connect("No", "otherwise", nodes[16]);
        nodes[15].connect(null, "otherwise", nodes[16]);
      });
  });
});




User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});