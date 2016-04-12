'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Claim Schema
 */
var ClaimSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Claim name',
    trim: true
  },
  content: {
    type: String,
    default: '',
    required: 'Please fill Claim content',
    trim: true
  },
  /////
  lat:{
    type: Number,
    default: 0,
    trim: true
  },
  lon:{
    type: Number,
    default: 0,
    trim: true
  },
  ///////
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Claim', ClaimSchema);
