(function(){
'use-strict'

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',foundItems);

NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
var menu = this;
menu.foundThese=[]; 
menu.searchTerm="";

menu.test=function(searchTerm){
  //print out differetn webdata.stuffs
  var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

    promise.then(function (response) {
      menu.foundThese=response;
      console.log(menu.foundThese);
    })
    .catch(function (error) {
      console.log(error);
    })
}
menu.remove=function(index){
    menu.foundThese.splice(index,1);
}

}//controller

MenuSearchService.$inject=['$http'];
function MenuSearchService($http){
var service=this;
 //service.menuSearch = function (searchTerm) 
service.getMatchedMenuItems=function(searchTerm){
   return $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(function(response){
      var foundItems = response.data.menu_items.filter(item => item.description.indexOf(searchTerm) !== -1); 
       return foundItems;
    }).catch(function (error) {
      console.log(error);
    });
  }
}//service

function foundItems(){
var ddo = {
    templateUrl: 'foundItems.html',
    scope: { 
    found: '<',//bound to parent controller's founditems
    onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'menu',//use to access controller inside template
    bindToController: true
  };
        return ddo;
}//dirctive

})();