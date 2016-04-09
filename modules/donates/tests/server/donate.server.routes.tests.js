'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Donate = mongoose.model('Donate'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, donate;

/**
 * Donate routes tests
 */
describe('Donate CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Donate
    user.save(function () {
      donate = {
        name: 'Donate name'
      };

      done();
    });
  });

  it('should be able to save a Donate if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Donate
        agent.post('/api/donates')
          .send(donate)
          .expect(200)
          .end(function (donateSaveErr, donateSaveRes) {
            // Handle Donate save error
            if (donateSaveErr) {
              return done(donateSaveErr);
            }

            // Get a list of Donates
            agent.get('/api/donates')
              .end(function (donatesGetErr, donatesGetRes) {
                // Handle Donate save error
                if (donatesGetErr) {
                  return done(donatesGetErr);
                }

                // Get Donates list
                var donates = donatesGetRes.body;

                // Set assertions
                (donates[0].user._id).should.equal(userId);
                (donates[0].name).should.match('Donate name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Donate if not logged in', function (done) {
    agent.post('/api/donates')
      .send(donate)
      .expect(403)
      .end(function (donateSaveErr, donateSaveRes) {
        // Call the assertion callback
        done(donateSaveErr);
      });
  });

  it('should not be able to save an Donate if no name is provided', function (done) {
    // Invalidate name field
    donate.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Donate
        agent.post('/api/donates')
          .send(donate)
          .expect(400)
          .end(function (donateSaveErr, donateSaveRes) {
            // Set message assertion
            (donateSaveRes.body.message).should.match('Please fill Donate name');

            // Handle Donate save error
            done(donateSaveErr);
          });
      });
  });

  it('should be able to update an Donate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Donate
        agent.post('/api/donates')
          .send(donate)
          .expect(200)
          .end(function (donateSaveErr, donateSaveRes) {
            // Handle Donate save error
            if (donateSaveErr) {
              return done(donateSaveErr);
            }

            // Update Donate name
            donate.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Donate
            agent.put('/api/donates/' + donateSaveRes.body._id)
              .send(donate)
              .expect(200)
              .end(function (donateUpdateErr, donateUpdateRes) {
                // Handle Donate update error
                if (donateUpdateErr) {
                  return done(donateUpdateErr);
                }

                // Set assertions
                (donateUpdateRes.body._id).should.equal(donateSaveRes.body._id);
                (donateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Donates if not signed in', function (done) {
    // Create new Donate model instance
    var donateObj = new Donate(donate);

    // Save the donate
    donateObj.save(function () {
      // Request Donates
      request(app).get('/api/donates')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Donate if not signed in', function (done) {
    // Create new Donate model instance
    var donateObj = new Donate(donate);

    // Save the Donate
    donateObj.save(function () {
      request(app).get('/api/donates/' + donateObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', donate.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Donate with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/donates/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Donate is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Donate which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Donate
    request(app).get('/api/donates/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Donate with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Donate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Donate
        agent.post('/api/donates')
          .send(donate)
          .expect(200)
          .end(function (donateSaveErr, donateSaveRes) {
            // Handle Donate save error
            if (donateSaveErr) {
              return done(donateSaveErr);
            }

            // Delete an existing Donate
            agent.delete('/api/donates/' + donateSaveRes.body._id)
              .send(donate)
              .expect(200)
              .end(function (donateDeleteErr, donateDeleteRes) {
                // Handle donate error error
                if (donateDeleteErr) {
                  return done(donateDeleteErr);
                }

                // Set assertions
                (donateDeleteRes.body._id).should.equal(donateSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Donate if not signed in', function (done) {
    // Set Donate user
    donate.user = user;

    // Create new Donate model instance
    var donateObj = new Donate(donate);

    // Save the Donate
    donateObj.save(function () {
      // Try deleting Donate
      request(app).delete('/api/donates/' + donateObj._id)
        .expect(403)
        .end(function (donateDeleteErr, donateDeleteRes) {
          // Set message assertion
          (donateDeleteRes.body.message).should.match('User is not authorized');

          // Handle Donate error error
          done(donateDeleteErr);
        });

    });
  });

  it('should be able to get a single Donate that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Donate
          agent.post('/api/donates')
            .send(donate)
            .expect(200)
            .end(function (donateSaveErr, donateSaveRes) {
              // Handle Donate save error
              if (donateSaveErr) {
                return done(donateSaveErr);
              }

              // Set assertions on new Donate
              (donateSaveRes.body.name).should.equal(donate.name);
              should.exist(donateSaveRes.body.user);
              should.equal(donateSaveRes.body.user._id, orphanId);

              // force the Donate to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Donate
                    agent.get('/api/donates/' + donateSaveRes.body._id)
                      .expect(200)
                      .end(function (donateInfoErr, donateInfoRes) {
                        // Handle Donate error
                        if (donateInfoErr) {
                          return done(donateInfoErr);
                        }

                        // Set assertions
                        (donateInfoRes.body._id).should.equal(donateSaveRes.body._id);
                        (donateInfoRes.body.name).should.equal(donate.name);
                        should.equal(donateInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Donate.remove().exec(done);
    });
  });
});
