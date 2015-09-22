'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  formidable = require('formidable'),
  fse = require('fs-extra'),
  errorHandler = require('./errors.server.controller'),
  Product = mongoose.model('Product'),
  _ = require('lodash');

/**
 * Create a product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current product
 */
exports.read = function(req, res) {
  res.json(req.product);
};

/**
 * Get products by user id
 */
exports.listByUserId = function(req, res) {
  Product
    .find({
      user: req.user,
      active: true
    })
    .sort('-created')
    .populate('user', '-salt -password')
    .populate('category', '-subCategory')
    .populate('subCategory')
    .exec(function(err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(products);
      }
    });
};

/**
 * Update a product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.user = product.user._id;

  Product.update({
    _id: product._id
  }, {
    $set: product.toJSON()
  }, function(err) {
    if (err) {
      console.log('err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });

  // product.save(function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(product);
  //   }
  // });
};

/**
 * Delete an product
 */
exports.delete = function(req, res, next) {
  var product = req.product;

  Product.update({
    _id: product._id
  }, {
    $set: {
      active: false
    }
  }, function(err, numAffected) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return next();
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product
    .find({
      active: true
    })
    .sort('-created')
    .populate('user', '-salt -password')
    .populate('category', '-subCategory')
    .populate('subCategory')
    .exec(function(err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(products);
      }
    });
};

/**
 * Shop for a product
 */
exports.shop = function(req, res) {
  var product = req.product;

  if (--product.stock < 0) {
    return res.status(400).send({
      message: 'Out of Stock'
    });
  }

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Upload a product image
 */
exports.uploadImage = function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    console.log('fields', fields);
    var productId = fields.productId;

    var imagePath = files.file.path;
    var imageName = 'image';

    fse.copy(imagePath, 'public/static/images/products/' + productId + '/image', function(err) {
      if (err) return res.status(500).send(err);
      res.status(200).send({
        message: 'SUCCESS'
      });
    });
  });
};

/**
 * Product middleware
 */
exports.productById = function(req, res, next, id) {
  Product
    .findById(id)
    .populate('user', '-salt -password')
    .populate('category', '-subCategory')
    .populate('subCategory')
    .exec(function(err, product) {
      if (err) return next(err);
      if (!product) return next(new Error('Failed to load product ' + id));
      req.product = product;
      next();
    });
};

/**
 * Check stock levels on user checkout
 */
exports.validateStock = function(req, res, next) {
  var cart = req.body.cart;
  Product
    .find({
      _id: {
        $in: cart.map(function(cartItem) {
          return cartItem.product._id;
        })
      }
    })
    .exec(function(err, productsArray) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var products = {};
        productsArray.forEach(function(product) {
          products[product._id] = product;
        });
        for (var i = cart.length - 1; i >= 0; --i) {
          if (cart[i].items > products[cart[i].product._id].stock) {
            break;
          }
        }
        if (i === -1) {
          req.cartProducts = products;
          return next();
        } else {
          return res.status(400).send({
            message: cart[i].product.name + ' went out of stock'
          });
        }
      }
    });
};

/**
 * Decrease stock is checkout is validated
 * (Runs in background)
 */
exports.decreaseStock = function(req, res, next) {
  next();
  var cart = req.body.cart;
  var cartProducts = req.cartProducts;
  async.map(cart, function(cartItem, callback) {
    Product
      .update({
        _id: cartItem.product._id
      }, {
        $set: {
          stock: cartProducts[cartItem.product._id].stock - cartItem.items
        }
      }, function(err) {
        callback(err);
      });
  }, function(err) {
    if (err) {
      console.log('err', err);
      console.log('ERROR: error occured during decreasing product stock');
    }
  });
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.product.user._id.toString() !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
