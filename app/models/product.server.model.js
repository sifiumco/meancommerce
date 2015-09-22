'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    required: 'Price cannot be blank'
  },
  stock: {
    type: Number,
    required: 'Initial stock level is required'
  },
  unit: {
    type: String,
    enum: ['units', 'kg', 'litres', 'grams'],
    default: ['units']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  subCategory: {
    type: Schema.ObjectId,
    ref: 'SubCategory'
  },
  active: {
    type: Boolean,
    default: true
  }
});

mongoose.model('Product', ProductSchema);
