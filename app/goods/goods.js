;(function(){	
	'use strict';
	angular
		.module('Goods',['ngRoute'])
		.config(configGoods)
		.controller('GoodsCtrl', GoodsCtrl);

	GoodsCtrl.$inject = ['$scope','$rootScope','$log'];

	function GoodsCtrl($scope,$rootScope,$log){
		$rootScope.curPath = 'goods';//что-то вроде глобальной переменной для использования во вьюхах
	}

	configGoods.$inject = ['$routeProvider'];

	function configGoods($routeProvider){
		$routeProvider.
			when("/",{
				templateUrl: "app/goods/goods.html",
				controller: 'GoodsCtrl',
				controllerAs: 'vm'
			});
	}
})();