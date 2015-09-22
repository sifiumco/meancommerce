'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  orders = require('../../app/controllers/orders.server.controller');

module.exports = function(app) {
  // Order Routes
  app.route('/orders')
    .get(orders.list);

  app.route('/orders/user')
    .get(orders.listByUser);

  app.route('/orders/:orderId')
    .get(orders.read)
    .put(users.requiresLogin, orders.update);

  // Finish by binding the article middleware
  app.param('orderId', orders.orderById);
};