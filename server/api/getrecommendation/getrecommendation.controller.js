'use strict';

var _ = require('lodash');
var Getrecommendation = require('./getrecommendation.model');
var parseString = require('xml2js').parseString;
var request = require('request');
var Flickr = require('flickrapi');
var async = require('async');
var flickrOptions = {
  api_key: "53226b5e399dde0a88c01bd8fc5574a6", //Jonah's Flickr Key
  secret: "4af75b9e0d695d4c"
};

//Get list of recommendations from TIXIK API and if no img url returned from TIXIK, search for relevant images on flickr

exports.getRecommendations = function(req, res) {
  request('http://www.tixik.com/en/api/nearby/?lat='+req.params.lat+'&lng='+req.params.lng +'&limit=100&key=demo', function (err, response, body) {

        parseString(body, function(err, result) { //Open parsestring
          var placesArr = result.tixik.items[0].item;
          var returnArr = [];
          var results = [];
          var Place = function(name, loc, gps_x, gps_y, url) {
            return {
              query: name + ", "+loc, //concat destination name to the name of place for easy google api text search following trip set up phase
              name: name,
              latitude: gps_x,
              longitude: gps_y,
              imgUrl: url
            };
          };

          var checkForImgUrl = function(place, done) {
            if (!place.tn_big[0]) {  //if TIXIK api does not return an img url, search flickr api for image.  Push any results from flickr to the object returned from TIXIK.
                Flickr.tokenOnly(flickrOptions, function(err, flickr) {
                    flickr.photos.search({
                    text: place.name,
                    safe_search: 1,
                    lat: req.params.lat,
                    lon: req.params.lng,
                    per_page: 1
                }, function(err, result) {
                    if (result.photos.photo[0]) {
                         var id = result.photos.photo[0].id,
                            farm = result.photos.photo[0].farm,
                            server = result.photos.photo[0].server,
                            secret = result.photos.photo[0].secret;
                        place.tn_big[0] = "https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+".jpg"; //adding the image url from flickr
                        var newplace = new Place(place.name[0], req.body.location, place.gps_x[0], place.gps_y[0], place.tn_big[0]);  //extract relevant properties from transformed TIXIK object and add to new place object
                        returnArr.push(newplace);
                    }
                    done(null);
                  });
                })
            } else { //if img url available from TIXIK api, just extract relevant properties from from TIXIK and add to new place object
              var newplace = new Place(place.name[0], req.body.location, place.gps_x[0], place.gps_y[0], place.tn_big[0]);
              returnArr.push(newplace);
              done(null);
            }
        };

          async.each(placesArr, checkForImgUrl, function(err) { //iterate over each of the places returned by TIXIK using checkForImgUrl as iterating function
            return res.json({array: returnArr});
          }); //close async

    });
  });
};


// Get list of getrecommendations
exports.index = function(req, res) {
  Getrecommendation.find(function (err, getrecommendations) {
    if(err) { return handleError(res, err); }
    return res.json(200, getrecommendations);
  });
};

// Get a single getrecommendation
exports.show = function(req, res) {
  Getrecommendation.findById(req.params.id, function (err, getrecommendation) {
    if(err) { return handleError(res, err); }
    if(!getrecommendation) { return res.send(404); }
    return res.json(getrecommendation);
  });
};

// Creates a new getrecommendation in the DB.
exports.create = function(req, res) {
  Getrecommendation.create(req.body, function(err, getrecommendation) {
    if(err) { return handleError(res, err); }
    return res.json(201, getrecommendation);
  });
};

// Updates an existing getrecommendation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Getrecommendation.findById(req.params.id, function (err, getrecommendation) {
    if (err) { return handleError(res, err); }
    if(!getrecommendation) { return res.send(404); }
    var updated = _.merge(getrecommendation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, getrecommendation);
    });
  });
};

// Deletes a getrecommendation from the DB.
exports.destroy = function(req, res) {
  Getrecommendation.findById(req.params.id, function (err, getrecommendation) {
    if(err) { return handleError(res, err); }
    if(!getrecommendation) { return res.send(404); }
    getrecommendation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}