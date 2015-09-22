'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  SubCategory = mongoose.model('SubCategory');

/**
 * Sub-Category middleware
 */
exports.add = function(req, res, next) {
  var subCategory = new SubCategory({
    subCategory: req.body.subCategory
  });

  subCategory.save(function(err, subCategory) {
    if (err) return next(err);
    req.subCategory = subCategory;
    next();
  });
};

/**
 * delete sub-category
 */
exports.delete = function(req, res, next) {
  console.log('req.category', req.category);
  var subCategories = [];
  if (req.category) {
    subCategories = req.category.subCategory.map(function(cat) {
      return cat._id;
    });
  } else {
    subCategories = [req.params.subCategoryId];
  }
  SubCategory.remove({
    _id: {
      $in: subCategories
    }
  }, function(err) {
    return next(err);
  });
};
