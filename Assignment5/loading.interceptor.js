(function() {
"use strict";
//An interceptor is a factory
angular.module('common')
.component('loading', {
  template: '<img src="../images/spinner.svg" ng-if="$ctrl.show">',
  controller: LoadingController
})  
.factory('loadingHttpInterceptor', LoadingHttpInterceptor);


LoadingController.$inject = ['$rootScope'];
function LoadingController ($rootScope) {
  var $ctrl = this;
  var listener;

  $ctrl.$onInit = function() {
    $ctrl.show = false;
    //namespace:action
    //this event is thrown when async happens
    listener = $rootScope.$on('spinner:activate', onSpinnerActivate);
  };
//unregister listener to protect memory leak
  $ctrl.$onDestroy = function() {
    listener();
  };

  function onSpinnerActivate(event, data) {
    $ctrl.show = data.on;
    //data.on true or false
  }
}

LoadingHttpInterceptor.$inject = ['$rootScope', '$q'];
/**
 * Tracks when a request begins and finishes. When a
 * request starts, a progress event is emitted to allow
 * listeners to determine when a request has been initiated.
 * When the response completes or a response error occurs,
 * we assume the request has ended and emit a finish event.
 */
function LoadingHttpInterceptor($rootScope, $q) {

  var loadingCount = 0;
  var loadingEventName = 'spinner:activate';
//increment counter every time there's a new request and a decrement counter every time one of the requests comes back
  return {
    request: function (config) {
      // console.log("Inside interceptor, config: ", config);

      if (++loadingCount === 1) {
        $rootScope.$broadcast(loadingEventName, {on: true});
      }
      return config;
    },

    response: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }
      return response;
    },

    responseError: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }
      return $q.reject(response);
//reject the promise or it'll look like the promise was resolved when it hasnt actually. 
//caller object will treat it as expected result
    }
  };
}

})();