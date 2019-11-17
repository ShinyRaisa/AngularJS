(function(){
'use-strict'

angular.module('data',[])
.service('MenuDataService', MenuDataService)

MenuDataService.$inject=['$http'];
function MenuDataService($http){
	var service=this;
	service.getAllCategories= function(){
	 return $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/categories.json"
    }).then(function(response){
      var categories = response.data;
       return categories;
    }).catch(function (error) {
      console.log(error);
    });
  }

  service.getItemsForCategory= function(categoryShortName){
  	return $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json",
      params:{
      	category: categoryShortName
      }//resultant website .. menu_items.json?category=categoryShortName
    }).then(function(response){
      var items = response.data;
       return items;
    }).catch(function (error) {
      console.log(error);
    });
  }
}
})();