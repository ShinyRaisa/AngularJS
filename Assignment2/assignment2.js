(function(){
'use strict'

angular.module('ShoppingListCheckOff',[])
.controller('ToBuyController',ToBuyController)
.controller('AlreadyBoughtController',AlreadyBoughtController)
.service('ShoppingListCheckOffService',ShoppingListCheckOffService);
 
ToBuyController.$inject=['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService){

var tbc = this;
tbc.tobuylist =ShoppingListCheckOffService.listItems();
tbc.afterBuying=function(index){
	ShoppingListCheckOffService.doneBuying(index);
	};

}

AlreadyBoughtController.$inject=['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService){
var alreadyBought=this;
alreadyBought.boughtlist =ShoppingListCheckOffService.boughtItems();
}


function ShoppingListCheckOffService(){
	var service=this;
	var tobuy=[
	{ name: "cookies", quantity: 10 },
	{ name: "chips", quantity: 3 },
	{ name: "chocolates", quantity: 30 },
	{ name: "creams", quantity: 10 },
	{ name: "canned soup", quantity: 10 }
	];
	var bought=[];	

	service.listItems=function(){
		return tobuy;
	}

	service.doneBuying = function (index) { 
    var item=tobuy[index];
    bought.push(item);
    tobuy.splice(index,1);
  };
  service.boughtItems=function(){
  	return bought;
  }
}
})();