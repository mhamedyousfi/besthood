'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Donate = mongoose.model('Donate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Donate
 */
exports.create = function(req, res) {
  var donate = new Donate(req.body);
  donate.user = req.user;

  donate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donate);
    }
  });
};

/**
 * Show the current Donate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var donate = req.donate ? req.donate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  donate.isCurrentUserOwner = req.user && donate.user && donate.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(donate);
};

/**
 * Update a Donate
 */
exports.update = function(req, res) {
  var donate = req.donate ;

  donate = _.extend(donate , req.body);

  donate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donate);
    }
  });
};

/**
 * Delete an Donate
 */
exports.delete = function(req, res) {
  var donate = req.donate ;

  donate.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donate);
    }
  });
};

/**
 * List of Donates
 */
exports.list = function(req, res) { 
  Donate.find().sort('-created').populate('user', 'displayName').exec(function(err, donates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donates);
    }
  });
};

/**
 * Donate middleware
 */
exports.donateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Donate is invalid'
    });
  }

  Donate.findById(id).populate('user', 'displayName').exec(function (err, donate) {
    if (err) {
      return next(err);
    } else if (!donate) {
      return res.status(404).send({
        message: 'No Donate with that identifier has been found'
      });
    }
    req.donate = donate;
    next();
  });
};
