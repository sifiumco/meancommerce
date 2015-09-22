'use strict';

var users = require('../../app/controllers/users.server.controller'),
  categories = require('../../app/controllers/categories.server.controller'),
  subCategories = require('../../app/controllers/subcategories.server.controller');

module.exports = function(app) {

  app.route('/categories')
    .get(categories.list)
    .post(users.requiresLogin, categories.create);

  app.route('/categories/image/upload')
    .post(users.requiresLogin, users.hasAuthorization(['admin']), categories.uploadImage);

  app.route('/categories/:categoryId')
    .get(categories.read)
    .put(users.requiresLogin, subCategories.add, categories.update)
    .delete(users.requiresLogin, subCategories.delete, categories.delete);

  app.route('/subCategories/:subCategoryId')
    .delete(users.requiresLogin, subCategories.delete, categories.pullSubCategory);

  // Finish by binding the category middleware
  app.param('categoryId', categories.categoryById);

};
