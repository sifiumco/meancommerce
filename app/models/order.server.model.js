'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  shortid = require('shortid'),
  deepPopulate = require('mongoose-deep-populate');

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String
  },
  cart: [{
    product: {
      type: Schema.ObjectId,
      ref: 'Product'
    },
    items: {
      type: Number,
      default: 0
    }
  }],
  address: {
    addressLine_1: String,
    addressLine_2: String,
    city: String,
    state: String,
    zip: Number
  },
  status: {
    type: String,
    enum: ['delivered', 'not delivered', 'cancelled', 'on process'],
    default: 'on process'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

OrderSchema.plugin(deepPopulate, {
  populate: {
    'cart.product.user': {
      select: '-salt -password -cart -roles'
    },
    'cart.product.category': {
      select: '-subCategory'
    }
  }
});

mongoose.model('Order', OrderSchema);
