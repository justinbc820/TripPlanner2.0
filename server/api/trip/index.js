'use strict';

var express = require('express');
var controller = require('./trip.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/addActivity', controller.addActivity);
router.post('/:id', controller.updateActivity);
// router.put('/:id/addDetails', controller.addDetails);
router.post('/wishlist/:id', controller.removeFromWishlist);
router.put('/wishlist/:id', controller.addToWishlist);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;