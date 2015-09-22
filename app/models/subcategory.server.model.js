'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sub-Category Schema
 */
var SubCategorySchema = new Schema({
  subCategory: {
    type: String,
    trim: true,
    required: 'sub-category cannot be blank',
  }
});

mongoose.model('SubCategory', SubCategorySchema);
