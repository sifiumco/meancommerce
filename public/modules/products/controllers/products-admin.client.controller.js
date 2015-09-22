'use strict';

// Products controller
angular.module('products').controller('ProductsAdminController', ['$scope', '$http', '$rootScope', '$stateParams', '$location', '$q', 'Upload', 'Authentication', 'Users', 'Products', 'Categories', 'Cart', 'Constants',
  function($scope, $http, $rootScope, $stateParams, $location, $q, Upload, Authentication, Users, Products, Categories, Cart, Constants) {
    $scope.authentication = Authentication;
    $scope.Constants = Constants;

    var categoryName = $stateParams.category ? $stateParams.category : null;

    $scope.productsLoaded = false;

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

    $scope.goTo = function(category) {
      $location.path('/products/admin/' + category.category);
      $rootScope.categorySelected = category.category;
      // console.log('name',$rootScope.categorySelected)
    };

    // Create new Product
    $scope.create = function() {
      if ($scope.selectedCategory && $scope.selectedCategory) {
        // Create new Product object
        var product = new Products.main({
          name: $scope.product.name,
          description: $scope.product.description,
          price: $scope.product.price,
          stock: $scope.product.stock,
          unit: $scope.product.unit,
          category: $scope.selectedCategory._id,
          subCategory: $scope.selectedSubCategory._id
        });

        product.$save(function(response) {
          $scope.productId = response._id;
          if ($scope.file) {
            imageUploader('products', function(err) {
              if (!err) {
                $scope.name = '';
                alert('Product added. Redirecting you to admin panel');
                $location.path('products/admin');
              } else {
                alert('Unable to upload image right now');
              }
            });
          } else {
            $scope.name = '';
            alert('Product added. Redirecting you to admin panel');
            $location.path('products/admin');
          }
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      } else {
        $scope.error = 'Please select a category and sub-category';
      }
    };

    // Remove existing Product
    $scope.remove = function(product) {
      if (product) {
        new Products.main(product).$remove(function() {
          for (var i in $scope.products) {
            if ($scope.products[i] === product) {
              $scope.products.splice(i, 1);
            }
          }
        });
      } else {
        new Products.main($scope.product).$remove(function() {
          $location.path('products/admin');
        });
      }
    };

    // Update existing Product
    $scope.update = function() {
      var product = new Products.main($scope.product);

      product.category = $scope.selectedCategory ? $scope.selectedCategory._id : $scope.product.category._id;
      product.subCategory = $scope.selectedSubCategory ? $scope.selectedSubCategory._id : $scope.product.subCategory._id;

      product.$update(function() {
        alert('Product updated. Redirecting you to admin panel.');
        $location.path('products/admin');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Products
    $scope.find = function() {
      return Products.user.query().$promise;
    };

    // Find existing Product
    $scope.findOne = function() {
      $scope.product = Products.main.get({
        productId: $stateParams.productId
      });
      $scope.product.$promise.then(function() {
        $scope.findCategoriesForEdit();
      });
    };

    // Find categories for edit page
    $scope.findCategoriesForEdit = function() {
      $scope.category = $scope.product.category;
      $scope.subCategory = $scope.product.subCategory;
      $scope.categories = Categories.query();
      $scope.categories.$promise.then(function() {
        for (var i = $scope.categories.length - 1; i >= 0; --i) {
          if ($scope.categories[i]._id === $scope.category._id) {
            $scope.subCategories = $scope.categories[i].subCategory;
          }
        }
      });
    };

    // Find all categories
    $scope.findCategories = function() {
      return Categories.query().$promise;
    };

    $scope.findCategoriesForAdding = function() {
      $rootScope.categories = Categories.query();
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
              $rootScope.categorySelected = categoryName;
              return category.category === categoryName;
            })[0];
            $rootScope.subCategories = $scope.selectedCategory.subCategory;
            $scope.$broadcast('collapsibleLoaded');
            filterProducts('category');
            $scope.productsLoaded = true;
          } else if (!$scope.productsLoaded) {
            $scope.products = products;
            $scope.productsLoaded = true;
          }
        });
    };

    // Select the category and get sub categories for a category
    $scope.selectCategory = function(category) {
      if (!$scope.selectedCategory || $scope.selectedCategory._id !== category._id) {
        $scope.selectedCategory = category;
        $rootScope.subCategories = $scope.selectedCategory.subCategory;
        filterProducts('category');
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
    };

    // Add a new category
    $scope.addCategory = function(cat) {
      var category = new Categories({
        category: cat.toUpperCase()
      });
      category.$save(function(response) {
        $rootScope.categories.push(response);
        $scope.selectedCategory = category;
        $rootScope.subCategories = $scope.selectedCategory.subCategory;
        $scope.cat = '';
        if ($scope.file) {
          imageUploader('categories', function(err) {
            if (err) {
              alert('Unable to upload image right now');
            }
          });
        }
      });
    };

    // Add a new sub-category
    $scope.addSubCategory = function(subCategory) {
      if (!$scope.selectedCategory) {
        $scope.error = 'Please select a category first';
        return;
      }
      var category = $scope.selectedCategory;
      category.subCategory = subCategory;
      category.$update(function(response) {
        $rootScope.subCategories = response.subCategory;
        $scope.selectedSubCategory = $scope.subCategories.filter(function(subCat) {
          return subCat.subCategory === subCategory;
        })[0];
        $scope.subCat = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.uploadImage = function(file) {
      if (file && file.length) {
        if ((/image/i).test(file[0].type) && file[0].size < 1000000) {
          $scope.file = file[0];
          if ($scope.productId) {
            $('#productImage').attr('src', $scope.Constants.preloader);
            imageUploader('products', function(err) {
              if (err) {
                alert('Unable to upload image right now');
              }
              $('#productImage').attr('src', '/static/images/products/' + $scope.productId + '/image');
            });
          }
        } else {
          alert('Image should be less than 1 Mb');
        }
      }
    };

    $scope.deleteCategory = function(category) {
      $http
        .delete('/categories/' + category._id)
        .then(function(data) {
          var pos = $scope.categories.indexOfCategory(category._id);
          if (pos !== -1) {
            $scope.categories.splice(pos, 1);
            $scope.selectedCategory = null;
            $scope.subCategories = [];
          }
        })
        .catch(function(err) {
          console.log('err', err);
          alert(err);
        });
    };

    $scope.deleteSubCategory = function(subCategory) {
      $http
        .delete('/subCategories/' + subCategory._id)
        .then(function(data) {
          var pos = $scope.subCategories.indexOfCategory(subCategory._id);
          if (pos !== -1) {
            $scope.subCategories.splice(pos, 1);
          }
        })
        .catch(function(err) {
          console.log('err', err);
          alert(err);
        });
    };

    Array.prototype.indexOfCategory = function(id) {
      for (var i = this.length - 1; i >= 0; --i) {
        if (this[i]._id === id) break;
      }
      return i;
    };

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

    var imageUploader = function(what, next) {
      var fields = {};
      if (what === 'products') {
        fields = {
          productId: $scope.productId
        };
      } else if (what === 'categories') {
        fields = {
          categoryId: $scope.selectedCategory._id
        };
      }
      Upload
        .upload({
          url: '/' + what + '/image/upload',
          file: $scope.file,
          fields: fields
        }).progress(function(e) {
          // var progressPercentage = parseInt(100.0 * e.loaded / e.total);
          // console.log('progress: ' + progressPercentage + '% of ' + e.config.file.name);
        }).success(function(data, status, headers, config) {
          // Clear form fields
          $scope.file = null;
          return next(null);
        }).error(function(err) {
          return next(err);
        });
    };
    setTimeout(function() {
      $('.dropdown-button').dropdown();
      $('.slider').slider({
        full_width: true,
        height: 412
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
