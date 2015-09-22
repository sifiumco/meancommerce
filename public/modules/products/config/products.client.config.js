'use strict';

// Configuring the Articles module
angular.module('products').run(['$state', '$rootScope', 'Menus', 'Authentication',
  function($state, $rootScope, Menus, Authentication) {

    $rootScope.$on('$stateChangeStart', function(e, to) {

      if (to.needAdmin && !Authentication.user) {
        e.preventDefault();
        $state.go('home');
      }
      if (to.needAdmin && Authentication.user && Authentication.user.roles.indexOf('admin') === -1) {
        e.preventDefault();
        $state.go('home');
      }
      if (to.needUser && Authentication.user && Authentication.user.roles.indexOf('user') === -1) {
        e.preventDefault();
        $state.go('listProductsByUser');
      }
    });



    // // Set top bar menu items if admin
    // if (Authentication.user && Authentication.user.roles.indexOf('admin') !== -1) {
    //   Menus.addMenuItem('topbar', 'Products', 'products', 'dropdown', '/products(/create)?');
    //   Menus.addSubMenuItem('topbar', 'products', 'List Products', 'products');
    //   Menus.addSubMenuItem('topbar', 'products', 'New Product', 'products/create');
    // }
  }
]);
