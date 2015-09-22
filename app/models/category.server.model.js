'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
  category: {
    type: String,
    trim: true,
    unique: true,
    required: 'Category cannot be blank',
  },
  subCategory: [{
  	type: Schema.ObjectId,
  	ref: 'SubCategory'
  }]
});

mongoose.model('Category', CategorySchema);
