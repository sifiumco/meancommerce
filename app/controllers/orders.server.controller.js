'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Order = mongoose.model('Order'),
  _ = require('lodash');

/**
 * Create a order
 */
exports.create = function(req, res, next) {
  var order = new Order({
    userId: req.user ? req.user._id : null,
    user: req.body.user,
    cart: req.body.cart.map(function(item) {
      return {
        product: item.product._id,
        items: item.items
      };
    }),
    address: req.body.address
  });

  order.save(function(err) {
    if (err) {
      console.log('err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.order = order;
      return next();
    }
  });
};

/**
 * Show the current order
 */
exports.read = function(req, res) {
  res.json(req.order);
};

/**
 * Update a order
 */
exports.update = function(req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function(err) {
    if (err) {
      console.log('err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Delete an order
 */
exports.delete = function(req, res) {
  var order = req.article;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
  Order
    .find()
    .sort('-created')
    .deepPopulate('cart.product cart.product.category cart.product.subCategory')
    .exec(function(err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(orders);
      }
    });
};

/**
 * List of Orders By User
 */
exports.listByUser = function(req, res) {
  Order
    .find({
      userId: req.user._id
    })
    .sort('-created')
    .deepPopulate('cart.product cart.product.category cart.product.subCategory')
    .exec(function(err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(orders);
      }
    });
};

/**
 * Order middleware
 */
exports.orderById = function(req, res, next, id) {
  Order
    .findById(id)
    .deepPopulate('cart.product cart.product.category cart.product.subCategory')
    .exec(function(err, order) {
      if (err) return next(err);
      if (!order) return next(new Error('Failed to load order ' + id));
      req.order = order;
      next();
    });
};

/**
 * order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.order.user._id !== req.user._id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
