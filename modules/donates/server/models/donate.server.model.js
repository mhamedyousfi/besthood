'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Donate Schema
 */
var DonateSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Donate name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Donate', DonateSchema);
