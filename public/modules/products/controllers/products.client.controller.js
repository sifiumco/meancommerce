'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope', '$stateParams', '$location', '$q', 'Authentication', 'Users', 'Products', 'Categories', 'Cart', 'Constants',
    function($scope, $rootScope, $stateParams, $location, $q, Authentication, Users, Products, Categories, Cart, Constants) {
        $scope.authentication = Authentication;
        $scope.Constants = Constants;

        var categoryName = $stateParams.category ? $stateParams.category : null;

        $scope.productsLoaded = false;

        $scope.items = 1;

        $scope.$watch(function() {
            return $rootScope.searchTerm;
        }, function(newVal, oldVal) {
            if (newVal && newVal !== '' && newVal !== oldVal) {
                $location.path('/products');
                $scope.products = products.filter(function(product) {
                    var _inName = new RegExp($rootScope.searchTerm, 'i').test(product.name);
                    var _inDescription = new RegExp($rootScope.searchTerm, 'i').test(product.description);
                    var _inCategory = product.category ? new RegExp($rootScope.searchTerm, 'i').test(product.category.category) : false;
                    var _inSubCategory = product.subCategory ? new RegExp($rootScope.searchTerm, 'i').test(product.subCategory.subCategory) : false;
                    return _inName || _inDescription || _inCategory || _inSubCategory;
                });
            }
        });

        // $scope.$watch(function(scope) {
        //   return scope.selectedCategory;
        // }, function(newVal, oldVal) {
        //   if (newVal && oldVal && newVal._id !== oldVal._id) {
        //     $location.path('/products/' + newVal.category);
        //   }
        // });

        // $scope.$watch(function(scope) {
        //   return scope.selectedSubCategory;
        // }, function() {
        //   console.log('before2products', products);
        //   if (products.length !== 0) {
        //     console.log('ifbefore2products', products);
        //     filterProducts('subCategory');
        //   }
        // });

        // Variable to store inital products before filtering
        var products = [];

        $scope.$watch(function(scope) {
            return scope.sortQuery;
        }, function(newVal) {
            if (newVal === 'low') {
                sortProducts('price', 'asc');
            } else if (newVal === 'high') {
                sortProducts('price', 'desc');
            }
        });

        $scope.goTo = function(category) {
            $location.path('/products/' + category.category);
            $rootScope.categorySelected = category.category;
            // console.log('name',$rootScope.categorySelected)
        };

        // Find a list of Products
        $scope.find = function() {
            // var deferred = $q.defer();
            // Products.main.query().$promise.then(function(prods) {
            //   prods.sort(function(a, b) {
            //     return a.stock - b.stock;
            //   });
            //   deferred.resolve(prods);
            // });
            return Products.main.query().$promise;
            // console.log('products', products)
            // products.$promise.then(function(products) {

            // });.sort(function(a, b) {
            //   return a.stock - b.stock;
            // });
            // console.log('products', products)
        };

        // Find existing Product
        $scope.findOne = function() {
            $scope.product = Products.main.get({
                productId: $stateParams.productId
            });
        };

        // Find all categories
        $scope.findCategories = function() {
            // var deferred = $q.defer();
            // Categories.query().$promise.then(function(categories) {
            //   deferred.resolve(categories);
            // });
            return Categories.query().$promise;
            // $scope.categories = Categories.query();
        };

        $scope.init = function() {
            $q.all([
                    $scope.find(),
                    $scope.findCategories()
                ])
                .then(function(data) {
                    products = data[0];
                    $rootScope.categories = data[1];
                    if (categoryName) {
                        $scope.selectedCategory = $rootScope.categories.filter(function(category) {
                            //console.log('here',category.category,categoryName)
                            $rootScope.categorySelected=categoryName;
                            return category.category === categoryName;
                        })[0];
                        $rootScope.subCategories = $scope.selectedCategory.subCategory;
                        $scope.$broadcast('collapsibleLoaded');
                        filterProducts('category');
                        $scope.productsLoaded = true;
                    }
                    if ($rootScope.searchTerm && categoryName) {
                        $scope.products = $scope.products.filter(function(product) {
                            var _inName = new RegExp($rootScope.searchTerm, 'i').test(product.name);
                            var _inDescription = new RegExp($rootScope.searchTerm, 'i').test(product.description);
                            var _inCategory = product.category ? new RegExp($rootScope.searchTerm, 'i').test(product.category.category) : false;
                            var _inSubCategory = product.subCategory ? new RegExp($rootScope.searchTerm, 'i').test(product.subCategory.subCategory) : false;
                            return _inName || _inDescription || _inCategory || _inSubCategory;
                        });
                        $scope.productsLoaded = true;
                    } else if ($rootScope.searchTerm && !categoryName) {
                        $scope.products = products.filter(function(product) {
                            var _inName = new RegExp($rootScope.searchTerm, 'i').test(product.name);
                            var _inDescription = new RegExp($rootScope.searchTerm, 'i').test(product.description);
                            var _inCategory = product.category ? new RegExp($rootScope.searchTerm, 'i').test(product.category.category) : false;
                            var _inSubCategory = product.subCategory ? new RegExp($rootScope.searchTerm, 'i').test(product.subCategory.subCategory) : false;
                            return _inName || _inDescription || _inCategory || _inSubCategory;
                        });
                        $scope.productsLoaded = true;
                    } else if (!$scope.productsLoaded) {
                        $scope.products = products;
                        $scope.productsLoaded = true;
                    }
                });
        };

        $scope.search = function(searchTerm) {
            $scope.products = products.filter(function(product) {
                var _inName = new RegExp(searchTerm, 'i').test(product.name);
                var _inDescription = new RegExp(searchTerm, 'i').test(product.description);
                var _inCategory = product.category ? new RegExp(searchTerm, 'i').test(product.category.category) : false;
                var _inSubCategory = product.subCategory ? new RegExp(searchTerm, 'i').test(product.subCategory.subCategory) : false;
                return _inName || _inDescription || _inCategory || _inSubCategory;
            });
        };

        // Select the category and get sub categories for a category
        $scope.selectCategory = function(category) {
            if (!$scope.selectedCategory || $scope.selectedCategory._id !== category._id) {
                $scope.selectedCategory = category;
                $rootScope.subCategories = $scope.selectedCategory.subCategory;
                filterProducts('category');
                $scope.sortQuery = '';
            }
            // $scope.subCategories = $scope.selectedCategory.subCategory;
        };

        // Select the sub-category
        $scope.selectSubCategory = function(subCategory) {
            if (subCategory === 'ALL') {
                $rootScope.subCategories = $scope.selectedCategory.subCategory;
                $scope.selectedSubCategory = null;
                filterProducts('category');
            } else {
                $scope.selectedSubCategory = subCategory;
                filterProducts('subCategory');
            }
            $scope.sortQuery = '';
        };

        // Add a new category
        $scope.addCategory = function(cat, keyEvent) {
            if (keyEvent.which === 13) {
                var category = new Categories({
                    category: cat.toUpperCase()
                });
                category.$save(function(response) {
                    $rootScope.categories.push(response);
                    // $scope.categories.push(response);
                    $scope.selectedCategory = category;
                    $rootScope.subCategories = $scope.selectedCategory.subCategory;
                    // $scope.subCategories = $scope.selectedCategory.subCategory;
                    category = '';
                });
            }
        };

        // Add a new sub-category
        $scope.addSubCategory = function(subCategory, keyEvent) {
            if (keyEvent.which === 13) {
                var category = $scope.selectedCategory;
                category.subCategory = subCategory;
                category.$update(function() {
                    $scope.selectedCategory.subCategory.push(subCategory);
                    $rootScope.subCategories = $scope.selectedCategory.subCategory;
                    // $scope.subCategories = $scope.selectedCategory.subCategory;
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        var timer;
        $scope.addToCart = function(product, items) {
            $scope.addedProduct = null;
            if (timer) {
                clearTimeout(timer);
            }
            $scope.addedProduct = product;
            timer = setTimeout(function() {
                $scope.addedProduct = null;
                $scope.$apply();
            }, 3000);
            if (items) {
                Cart.addToCart(product, items, function(cart) {
                    if ($scope.authentication.user) {
                        $scope.authentication.user.cart = cart;
                    }
                });
            } else {
                Cart.addToCart(product, function(cart) {
                    if ($scope.authentication.user) {
                        $scope.authentication.user.cart = cart;
                    }
                });
            }
        };

        $scope.showAll = function() {
            $scope.products = products;
        };

        var sortProducts = function(field, order) {
            $scope.products.sort(function(a, b) {
                if (order === 'asc') {
                    return a[field] - b[field];
                } else if (order === 'desc') {
                    return b[field] - a[field];
                }
            });
        };

        // $scope.filterProductsBy = function(option, value) {
        //   $scope.products = [];
        //   var pos = filter[option].indexOf(value._id);
        //   if (pos === -1) {
        //     filter[option].push(value._id);
        //   } else {
        //     filter[option].splice(pos, 1);
        //   }
        //   if (filter.subCategory.length === 0 && filter.category.length === 0) {
        //     $scope.products = products;
        //   } else {
        //     products.forEach(function(product) {
        //       if ((filter.subCategory.length !== 0 && filter.subCategory.indexOf(product.subCategory._id) !== -1) ||
        //         (filter.category.length !== 0 && filter.category.indexOf(product.category._id) !== -1)) {
        //         $scope.products.push(product);
        //       }
        //     });
        //   }
        //   console.log('filter', $scope.products.map(function(prod) {
        //     return prod.name;
        //   }));
        // };

        var filterProducts = function(by) {
            if ($scope.selectedCategory || $scope.selectedSubCategory) {
                $scope.products = products.filter(function(product) {
                    if (by === 'category') {
                        return product.category && product.category._id === $scope.selectedCategory._id;
                    } else if (by === 'subCategory') {
                        return product.subCategory && product.subCategory._id === $scope.selectedSubCategory._id;
                    }
                });
            }
        };

        // Array.prototype.addToSet = function(item) {
        //   if (this.indexOf(item) === -1) {
        //     this.push(item);
        //   }
        // };


        setTimeout(function() {
            $('.dropdown-button').dropdown();
            $('.slider').slider({
                full_width: true,
                height: 412
            });

//  $('#d2').contenthover({
//     overlay_background:'#000',
//     overlay_opacity:0.8
// });
            $('#search').on('click', function(e) {
                $('#search1').toggle();
                $(this).toggleClass('class1');
            });

            $('.button-collapse').sideNav({
                menuWidth: 240,
                activationWidth: 300,
                edge: 'left',
                closeOnClick: true
            });
        }, 0);



    }
]);
