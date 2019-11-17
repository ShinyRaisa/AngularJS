(function(){
'use-strict';			//['ui.bootstrap']
angular.module('LunchCheck',[]).controller('LunchCheckController',LunchCheckController);
LunchCheckController.$inject=['$scope'];

function LunchCheckController($scope){
$scope.inputtxt="";
$scope.msg="";
$scope.checkInput= function (){
	if ($scope.inputtxt=="") {
		$scope.msg="Enter Text First";
	}
 	else if ($scope.inputtxt.split(',').length<=3) {
		$scope.msg="Enjoy";
 	}
 	else{
 		$scope.msg="Too Much!";
 	}
};
$scope.getColor= function(msg) {
   return msg==="Enjoy" || msg==="Too Much!" ? "green" : "red";
}

 }//LunchCheckController


})();