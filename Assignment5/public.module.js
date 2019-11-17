(function() {
"use strict";
/**
 * Public restaurant application. Includes the common module and ui-router.
 */
angular.module('public', ['ui.router','common'])
.component('menuCategory', {
  templateUrl: 'menu-category.html',
  bindings: {
    category: '<'
  }
})
.config(routeConfig)
.controller('MenuController', MenuController)
.controller('MenuItemsController', MenuItemsController)
.component('menuItem', {
  templateUrl: 'menu-item.html',
  bindings: {
    menuItem: '<',//WITH PARENT CONTROLLER MenuItemsController
//thiscomponent is placed within menu-items state
    x:'<'
  },
//to use the injection to inject that APIpath into it default $ctrl wont work
  controller: MenuItemController
})
.controller('SignUpController',SignUpController)
.controller('MyInfoController',MyInfoController)
.service('UserInfoService',UserInfoService);

MenuItemController.$inject = ['ApiPath'];
function MenuItemController(ApiPath) {
  var $ctrl = this;
  $ctrl.basePath = ApiPath;
  console.log($ctrl)
}
/**
 * Configures the routes and views
 */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('public', {
//cant directly go to this stateparent to other states that other states can inherit from and share attributes of the state
//async calls using $http serviceo
      abstract: true,
      templateUrl: 'public.html'
    })
    .state('public.home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('public.menu', {
      url: '/menu',
      templateUrl: 'menu.html',
      controller: 'MenuController',
      controllerAs: 'menuCtrl',
      resolve: {
        menuCategories: ['MenuService', function (MenuService) {
          return MenuService.getCategories();
        }]
      }
    })
    .state('public.menuitems', {
      url: '/menu/{category}',
      templateUrl: 'menu-items.html',
      controller: 'MenuItemsController',
      controllerAs: 'menuItemsCtrl',
      resolve: {
        menuItems: ['$stateParams','MenuService', function ($stateParams, MenuService) {
          return MenuService.getMenuItems($stateParams.category);
        }]
      }
    })
    .state('public.signup',{
      url:'/signup',
      templateUrl:'signupStateTemplate.html',
      controller: 'SignUpController',
      controllerAs: 'signUpCtrl'
    })
    .state('public.myinfo',{
      url:'/myinfo',
      templateUrl:'myinfoStateTemplate.html',
      controller: 'MyInfoController',
      controllerAs: 'myInfoCtrl'
    });
}

MenuController.$inject = ['menuCategories'];
function MenuController(menuCategories) {
  var $ctrl = this;
  $ctrl.menuCategories = menuCategories;
  //console.log($ctrl.menuCategories)
}
MenuItemsController.$inject = ['menuItems'];
function MenuItemsController(menuItems) {
  var $ctrl = this;
  $ctrl.menuItems = menuItems;
  $ctrl.category=menuItems.category
  console.log($ctrl.menuItems)//has category array menu_items array
}

SignUpController.$inject = ['$http','UserInfoService'];
function SignUpController($http,UserInfoService) {
  var $ctrl = this;

  $ctrl.getFavDish=function(){
    $http({
      method:"GET",
      url:"https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(function(response){
      var y=response.data;
      
      y.menu_items.filter(function(e){return e.short_name==$ctrl.user.favdish})
          .map(function(e){$ctrl.user.dishinfo=e});
          console.log($ctrl.user.dishinfo);

       if($ctrl.user.dishinfo==undefined){
        $ctrl.invalidMenu=true;
       };
       $ctrl.user.cat = $ctrl.user.favdish.replace(/[^a-zA-Z]+/g, '');
       $ctrl.user.exists=true
       UserInfoService.saveInfo($ctrl.user);
    }) 
    $ctrl.invalidMenu=false;   
  }
}

}
MyInfoController.$inject = ['UserInfoService'];
function MyInfoController(UserInfoService){
  var $ctrl=this; 
  $ctrl.userInfo=UserInfoService.getInfo()
 console.log($ctrl.userInfo)
}
//UserInfoService
function UserInfoService(){
 var service=this;
 service.info={}
 service.saveInfo=function(info){
  service.info=info;
 }
service.getInfo=function(){
  return service.info;
 }
}
})();