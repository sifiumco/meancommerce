'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require('./config');

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User
      .findOne({
        _id: id
      })
      .deepPopulate('cart.product cart.product.user cart.product.category cart.product.subCategory')
      .select('-salt -password')
      .exec(function(err, user) {
        done(err, user);
      });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
    require(path.resolve(strategy))();
  });
};
