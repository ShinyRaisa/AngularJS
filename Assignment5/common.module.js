// a separate module that both of our modules public and the future administrative module can depend on and then share.
(function() {
"use strict";

angular.module('common', [])             
.config(config)//https://ychaikin-course5.herokuapp.com
.constant('ApiPath', 'https://davids-restaurant.herokuapp.com')
.service('MenuService', MenuService)

config.$inject = ['$httpProvider'];
function config($httpProvider) {
//array of interceptors ,http service checks if any of these interceptors need to hdeal with req/resp before going through the req  
//push the interceptor we made
  $httpProvider.interceptors.push('loadingHttpInterceptor');
};
//
MenuService.$inject = ['$http', 'ApiPath'];
function MenuService($http, ApiPath) {
  var service = this;

  service.getCategories = function () {
    return $http.get(ApiPath + '/categories.json').then(function (response) {
      return response.data;
    });
  };
service.getMenuItems = function (category) {
    var config = {};
    //if category exists
    if (category) {
      config.params = {'category': category};
    }
//http  service expects config object with params property on url
    return $http.get(ApiPath + '/menu_items.json', config)
    .then(function (response) {
      return response.data;
    });
  };
}
})();