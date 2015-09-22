'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  formidable = require('formidable'),
  fse = require('fs-extra'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('Category');

/**
 * Create a Category
 */
exports.create = function(req, res) {
  var category = new Category(req.body);

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Show the current category
 */
exports.read = function(req, res) {
  res.json(req.category);
};

/**
 * Update a category
 */
exports.update = function(req, res) {
  var category = req.category;

  category.subCategory.push(req.subCategory);

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find().sort('category').populate('subCategory').exec(function(err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

/**
 * Delete a category
 */
exports.delete = function(req, res) {
  Category.remove({
    _id: req.category._id
  }, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(req.category);
    }
  });
};

/**
 * Pull sub category
 */
exports.pullSubCategory = function(req, res, next) {
  Category.findOne({
    subCategory: req.params.subCategoryId
  }, function(err, category) {
    console.log('category', category);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Category.update({
        _id: category._id
      }, {
        $pull: {
          subCategory: req.params.subCategoryId
        }
      }, function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(req.params.subCategoryId);
        }
      });
    }
  });
};

/**
 * Upload a category image
 */
exports.uploadImage = function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var categoryId = fields.categoryId;

    var imagePath = files.file.path;
    var imageName = 'image';

    fse.copy(imagePath, 'public/static/images/category/' + categoryId, function(err) {
      if (err) return res.status(500).send(err);
      return res.status(200).send({
        message: 'SUCCESS'
      });
    });
  });
};

/**
 * Category middleware
 */
exports.categoryById = function(req, res, next, id) {
  Category.findById(id).populate('subCategory').exec(function(err, category) {
    if (err) return next(err);
    if (!category) return next(new Error('Failed to load category ' + id));
    req.category = category;
    next();
  });
};
