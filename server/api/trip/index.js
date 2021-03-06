'use strict';

var express = require('express');
var controller = require('./trip.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/addActivity', controller.addActivity);
router.post('/:id/deleteActivity', controller.deleteActivity);
router.post('/:id', controller.updateActivity);
router.put('/:id/acceptinvite', controller.acceptInvite);
// router.put('/:id/addDetails', controller.addDetails);
router.put('/wishlist/:id', controller.addToWishlist);
router.post('/wishlist/:id', controller.removeFromWishlist);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;