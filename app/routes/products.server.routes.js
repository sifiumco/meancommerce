'use strict';

var users = require('../../app/controllers/users.server.controller'),
  products = require('../../app/controllers/products.server.controller'),
  categories = require('../../app/controllers/categories.server.controller');

module.exports = function(app) {

  app.route('/products')
    .get(products.list)
    .post(users.requiresLogin, users.hasAuthorization(['admin']), products.create);

  app.route('/products/user')
    .get(users.requiresLogin, users.hasAuthorization(['admin']), products.listByUserId);

  app.route('/products/image/upload')
    .post(users.requiresLogin, users.hasAuthorization(['admin']), products.uploadImage);

  app.route('/products/:productId')
    .get(products.read)
    .put(users.requiresLogin, products.hasAuthorization, products.update)
    .delete(users.requiresLogin, products.hasAuthorization, products.delete, users.deleteCartItem);

  app.route('/products/:productId/shop')
    .put(users.requiresLogin, products.shop);

  // Finish by binding the product middleware
  app.param('productId', products.productById);

};