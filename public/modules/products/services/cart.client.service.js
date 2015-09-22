'use strict';

angular.module('products').factory('Cart', ['localStorageService', 'Users', 'Authentication', 'Util',
  function(localStorageService, Users, Authentication, Util) {



    return {
      isLocalCart: function() {
        return localStorageService.keys().indexOf('cart') === -1 ? false : true;
      },
      getCart: function() {
        var user = Authentication.user;
        if (user) {
          return user.cart;
        } else {
          return localStorageService.get('cart');
        }
      },
      setCart: function(cart, next) {
        var user = Authentication.user;
        if (user) {
          user.cart = cart;
          new Users(user).$update(function(user) {
            return next(user.cart);
          });
        } else {
          localStorageService.set('cart', cart);
          return next(cart);
        }
      },
      setItemsByNo: function(product, items, next) {
        var cart = this.getCart();
        for (var i=cart.length-1; i>=0; --i) {
          if (cart[i].product._id === product._id) {
            break;
          }
        }
        cart[i].items = items;
        this.setCart(cart, next);
      },
      removeItem: function(product, next) {
        var cart = this.getCart();
        for (var i=cart.length-1; i>=0; --i) {
          if (cart[i].product._id === product._id) {
            break;
          }
        }
        cart.splice(i, 1);
        this.setCart(cart, next);
      },
      setItems: function(pos, op, next) {
        var self = this;
        var cart = self.getCart();
        if (op === 'inc') {
          cart[pos].items++;
        } else {
          cart[pos].items--;
        }
        if (cart[pos].items <= 0) {
          self.removeCartItem(cart, pos, function(cart) {
            self.setCart(cart, function(cart) {
              return next(0);
            });
          });
        } else {
          self.setCart(cart, function(cart) {
            return next(cart[pos].items);
          });
        }
      },
      removeCartItem: function(cart, pos, next) {
        cart.splice(pos, 1);
        return next(cart);
      },
      addToCart: function(product, items, next) {
        if (typeof items === 'function') {
          next = items;
          items = 1;
        }
        var user = Authentication.user;
        var cart = this.getCart();
        if (!cart) {
          cart = [{
            product: product,
            items: items
          }];
        } else {
          var inserted = false;
          cart.forEach(function(cartItem) {
            if (cartItem.product._id === product._id) {
              cartItem.items += items;
              inserted = true;
            }
          });
          if (!inserted) {
            cart.unshift({
              product: product,
              items: items
            });
          }
        }
        this.setCart(cart, next);
      },
      increaseItem: function(cartItem, next) {
        var user = Authentication.user;
        var cart = this.getCart();
        this.setItems(Util.indexOfCartItem(cart, cartItem), 'inc', next);
      },
      decreaseItem: function(cartItem, next) {
        var user = Authentication.user;
        var cart = this.getCart();
        this.setItems(Util.indexOfCartItem(cart, cartItem), 'dec', next);
      },
      mergeCart: function(next) {
        var cart = this.getCart();
        if (this.isLocalCart()) {
          var localCart = localStorageService.get('cart');
          localCart.forEach(function(cartItem) {
            var pos = Util.indexOfCartItem(cart, cartItem);
            if (pos === -1) {
              cart.push(cartItem);
            } else {
              cart[pos].items += cartItem.items;
            }
          });
          localStorageService.remove('cart');
          this.setCart(cart, function(cart) {
            return next(cart);
          });
        } else {
          return next(cart);
        }
      },
      emptyCart: function() {
        localStorageService.remove('cart');
      }
    };
  }
]);
