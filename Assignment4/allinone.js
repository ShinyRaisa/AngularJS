(function(){
'use-strict'

angular.module('MenuApp',['data','ui.router'])
.config(RoutesConfig)
.controller('categoriesController',categoriesController)
.controller('itemsController',itemsController)
.component('categories', {
 templateUrl: 'categoriesComponentTemplate.html',
 bindings: {
    name: '<'//bound to it's controller's prop ctgctrl.name
   }
})
// categoriesComponentTemplate.html
// <h3>Category Component Template</h3>
// <ul>
//   <li ng-repeat="item in $ctrl.name">
//items state invoked as a method,({param with $stateParams thing: item's short_name value passed })
//       <a ui-sref="items({categoryShortName: item.short_name})">{{item.name}}</a>
//   </li>
// </ul>
.component('items', {
 templateUrl: 'itemsComponentTemplate.html',
 bindings: {
    items: '<'
  }
});
// itemsComponentTemplate.html
// <ul>
//   <li ng-repeat="item in $ctrl.items">
//     {{item.name}}
//   </li>
// </ul>
RoutesConfig.$inject = ['$stateProvider','$urlRouterProvider'];
function RoutesConfig($stateProvider,$urlRouterProvider){
// Redirect to home page if no other URL matches
  $urlRouterProvider.otherwise('/');
 // *** Set up UI states ***
  $stateProvider

  // Home page
  .state('home', {
    url: '/',
    templateUrl: 'homeTemplate.html'
  })
// homeTemplate.html
// <a ui-sref="home">Home</a> &gt; 
// <a ui-sref="categories">Show Categories</a>
// <h3>Home</h3>
// <ui-view></ui-view>
  .state('categories',{
  	url:'/categories',
  	controller:'categoriesController as ctgctrl',
    templateUrl: 'categoriesStateTemplate.html',
  	resolve: {
      resolvedcategories: ['MenuDataService', function (MenuDataService) {
        return MenuDataService.getAllCategories();
      }]
    }
  })
// categoriesStateTemplate.html
// <a ui-sref="home">Home</a>&gt;
// <span>Categories</span>
// <div> 
//   <h3>Categories</h3><!--component's 'name' is bound to categories state controller's ctgctrl.name-->
//   <categories name=ctgctrl.name></categories>
// </div>  
  .state('items',{
  	url:'/items/{categoryShortName}',
  	controller:'itemsController as itemctrl',
    templateUrl: 'itemsStateTemplate.html',
  	resolve: {
      resolveditems: ['MenuDataService','$stateParams', function (MenuDataService,$stateParams) {
        return MenuDataService.getItemsForCategory($stateParams.categoryShortName);
      }]
    }
  })
// itemsStateTemplate.html
// <a ui-sref="home">Home</a>&gt;
// <a ui-sref="categories">Categories</a> &gt;
// <a ui-sref="items">Items</a>
// <div>
//   Items Detail
//   <items items=itemctrl.name.menu_items></items>
// </div>
}
categoriesController.$inject=['resolvedcategories']
function categoriesController(resolvedcategories){
	var ctgctrl=this;
	ctgctrl.name=resolvedcategories;
}

itemsController.$inject=['resolveditems']
function itemsController(resolveditems){
	var itemctrl=this;
	itemctrl.name=resolveditems;
}


})()