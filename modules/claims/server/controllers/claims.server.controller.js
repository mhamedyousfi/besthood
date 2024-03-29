'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Claim = mongoose.model('Claim'),
    Community = mongoose.model('Community'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a Claim
 */
exports.create = function(req, res) {
  var claim = new Claim(req.body);
  claim.user = req.user;
  claim.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(claim);
    }
  });
};
/**
 * Show the current Claim
 */

exports.read = function(req, res) {
  // convert mongoose document to JSON
  var claim = req.claim ? req.claim.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  claim.isCurrentUserOwner = req.user && claim.user && claim.user._id.toString() === req.user._id.toString() ? true : false;
  claim.isCommunity = req.user && claim.user && claim.user.community.city === req.user.community.city ? true : false;
  res.jsonp(claim);
};


/**
 * Update a Claim
 */
exports.update = function(req, res) {
  var claim = req.claim ;

  claim = _.extend(claim , req.body);

  claim.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(claim);
    }
  });
};

/**
 * Delete an Claim
 */
exports.delete = function(req, res) {
  var claim = req.claim ;

  claim.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(claim);
    }
  });
};

/**
 * List of Claims
 */
exports.list = function(req,res) {

  Claim.find()
      .sort('-created').deepPopulate('user user.community').exec(function(err, claims) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0, len = claims.length; i < len; i++) {
        Community.populate(claims[i].user,
            { path : 'user.community',
              select: 'city',
              model: 'Community'});
      }
      res.jsonp(claims);
    }
  });
};

/**
 * Claim middleware
 */
exports.claimByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Claim is invalid'
    });
  }

  Claim.findById(id).deepPopulate('user user.community').exec(function (err, claim) {
    if (err) {
      return next(err);
    } else if (!claim) {
      return res.status(404).send({
        message: 'No Claim with that identifier has been found'
      });
    }
    Community.populate(claim.user,
        { path : 'user.community',
          select: 'city',
          model: 'Community'});
    req.claim = claim;
    next();
  });
};
