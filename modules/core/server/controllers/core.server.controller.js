'use strict';

var validator = require('validator'),
    nodemailer = require('nodemailer');

exports.renderIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      community: req.user.community,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });

};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
var gmTransport = nodemailer.createTransport('SMTP',{
  service: 'Gmail',
  auth: {
    user: 'oumaima.bouyahi@esprit.tn',
    pass: '22506954o'
  }
});

exports.sendContact = function(req, res) {

  // logs to grunt task
  console.log('sent inquiry');

  var mailOptions = {
    to : 'mhamed.yousfi@esprit.tn',
    subject : 'Inquiry from: [' + req.body.name + ']',
    html: req.body.inquiry
  };

  gmTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Message sent: ' + response.message);
    }
  });
};


