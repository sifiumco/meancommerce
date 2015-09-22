'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  request = require('superagent'),
  config = require('../../../config/config'),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user;
  var message = null;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    User.update({
      _id: user._id
    }, {
      $set: _.omit(user.toObject(), '_id')
    }, function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });

    // user.save(function(err) {
    //  if (err) {
    //    console.log('err', err);
    //    return res.status(400).send({
    //      message: errorHandler.getErrorMessage(err)
    //    });
    //  } else {
    //    req.login(user, function(err) {
    //      if (err) {
    //        res.status(400).send(err);
    //      } else {
    //        res.json(user);
    //      }
    //    });
    //  }
    // });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Delete unreferenced cart item
 */
exports.deleteCartItem = function(req, res) {
  User.update({}, {
    $pull: {
      cart: {
        product: req.product._id
      }
    }
  }, {
    multi: true
  }, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.send(req.product);
    }
  });
};

/**
 * Add address
 */
exports.addAddress = function(req, res) {
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    $push: {
      address: req.body
    }
  }, {
    new: true
  }, function(err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      delete user.salt;
      delete user.password;
      req.user = user;
      return res.send(user);
    }
  });
};

/**
 * Delete address
 */
exports.deleteAddress = function(req, res) {
  var addressId = req.params.addressId;
  User.update({
    _id: req.user._id
  }, {
    $pull: {
      address: {
        _id: addressId
      }
    }
  }, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.send(req.user);
    }
  });
};

/**
 * Get cart items if user is logged in
 */
exports.getCart = function(req, res, next) {
  if (!req.user) {
    req.cart = req.body.cart;
    return next();
  }
  req.cart = req.user.cart;
  User
    .findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: {
        cart: []
      }
    }, {
      new: true
    }, function(err, user) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to unset cart for user: ' + req.user._id
        });
      } else {
        req.user = user;
        return next();
      }
    });
};

/**
 * Generate checkout mail
 */
exports.checkout = function(req, res) {
  res.status(200).send({
    order: req.order,
    message: config.client.successCheckoutMessage
  });
  var user = req.body.user;
  var address = req.order.address;
  var cartTotal = 0;
  req.cart.forEach(function(cartItem) {
    cartTotal += cartItem.items * cartItem.product.price;
  });
  async.parallel([
    function(callback) {
      res.render('templates/checkout-bill', {
        orderId: req.order._id,
        user: user,
        appName: config.app.title,
        cart: req.cart,
        cartTotal: cartTotal,
        address: address,
        dated: new Date().toString()
      }, function(err, emailHTML) {
        var smtpTransport = nodemailer.createTransport(config.mailer.options);
        var mailOptions = {
          to: config.client.email,
          from: config.mailer.from,
          subject: 'A new purchase',
          html: emailHTML
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          callback(err);
        });
      });
    },
    function(callback) {
      res.render('templates/checkout-bill', {
        orderId: req.order._id,
        user: user,
        appName: config.app.title,
        cart: req.cart,
        cartTotal: cartTotal,
        address: address,
        dated: new Date().toString()
      }, function(err, emailHTML) {
        var smtpTransport = nodemailer.createTransport(config.mailer.options);
        var mailOptions = {
          to: user.email,
          from: config.mailer.from,
          subject: 'Your purchase details',
          html: emailHTML
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          callback(err);
        });
      });
    },
    function(callback) {
      if (user.phone.length === 11) {
        user.phone = user.phone.substring(1, user.phone.length);
      }
      if (user.phone.length === 10) {
        user.phone = '91' + user.phone;
      }
      request
        .get('http://fastsms.way2mint.com/SendSMS/sendmsg.php')
        .query({ uname: config.sms.auth.uname })
        .query({ pass: config.sms.auth.pass })
        .query({ send: config.sms.send })
        .query({ dest: user.phone })
        .query({ msg: 'Your checkout has been confirmed.\nTotal bill amounting to ' + cartTotal + '.\nYour order ID is: ' + req.order._id })
        .end(function(err, res) {
          callback(err);
        });
    },
    function(callback) {
      request
        .get('http://fastsms.way2mint.com/SendSMS/sendmsg.php')
        .query({ uname: config.sms.auth.uname })
        .query({ pass: config.sms.auth.pass })
        .query({ send: config.sms.send })
        .query({ dest: config.client.phone })
        .query({ msg: 'A new purchase with a total bill amounting to ' + cartTotal + '.\nOrder ID: ' + req.order._id})
        .end(function(err, res) {
          callback(err);
        });
    }
  ], function(err) {
    if (err) {
      console.log('ERROR in sending mail/sms: ', err);
    }
  });
};
