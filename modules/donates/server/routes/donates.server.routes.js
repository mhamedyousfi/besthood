'use strict';

/**
 * Module dependencies
 */
var donatesPolicy = require('../policies/donates.server.policy'),
  donates = require('../controllers/donates.server.controller');

module.exports = function(app) {
  // Donates Routes
  app.route('/api/donates').all(donatesPolicy.isAllowed)
    .get(donates.list)
    .post(donates.create);

  app.route('/api/donates/:donateId').all(donatesPolicy.isAllowed)
    .get(donates.read)
    .put(donates.update)
    .delete(donates.delete);

  // Finish by binding the Donate middleware
  app.param('donateId', donates.donateByID);
};
