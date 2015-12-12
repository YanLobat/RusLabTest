(function () {
	'use strict';
	//подключение модулей различных страниц
	angular
		.module('RusLabTest', [
				'RusLabTest.goods',
				'ui.router',
				]);
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods',['ui.router']);
})();
(function () {
	'use strict';
	//подключение модулей различных страниц
	angular
		.module('RusLabTest')
		.config(Config);
		Config.$inject = ['$stateProvider','$urlRouterProvider'];
		function Config($stateProvider, $urlRouterProvider) {   
	         $urlRouterProvider.otherwise('/');
		};
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsCtrl', GoodsCtrl);
	GoodsCtrl.$inject = ['$scope','$rootScope','$log','$http','$state'];

	function GoodsCtrl($scope,$rootScope,$log,$http,$state){
		var vm = this;
		vm.goods = [];
		vm.getJSON = function(){
			$http.get("/app/test.json")
    		.then(function(response) {
    			vm.goods = response.data.items;
    		});
		};
		$rootScope.curPath = 'goods';//что-то вроде глобальной переменной для использования во вьюхах
	}
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsItemCtrl', GoodsItemCtrl)
	GoodsItemCtrl.$inject = ['$scope','$rootScope','$log','$http','$state','$stateParams','$q'];

	function GoodsItemCtrl($scope,$rootScope,$log,$http,$state,$stateParams,$q){
		var vm = this;
		vm.item = $stateParams.good;
		if (!vm.item){
			var def = $q.defer();
			vm.item= $http.get("/app/test.json")
    		.then(function(response) {
    			for (var i = 0; i < response.data.items.length; i++){
    				if (response.data.items[i].id == $stateParams.id){
    					def.resolve(response.data.items[i])
    					return def.promise;
    				}
    			}
    		});
    		console.log(vm.item);
    		//vm.i = Promise.resolve(vm.item);
    		//console.log(vm.i);
		}
		$rootScope.curPath = 'goods-item';//что-то вроде глобальной переменной для использования во вьюхах
	}
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.config(configGoods);
	 configGoods.$inject = ['$stateProvider','$urlRouterProvider'];
	 function configGoods($stateProvider,$urlRouterProvider){
	 	$stateProvider
	        .state('goods', {
	        	abstract: true,
	        	templateUrl: "app/goods/goods.html",
	        })
	        .state('goods.list', {
	        	url: "/",
	        	templateUrl: "app/goods/goods-list.html",
	        })
	        .state('goods.item', {
	         	url: "/:id",
	            templateUrl: "app/goods/goods-item.html",
	            controller: 'GoodsItemCtrl',
	            params: {good: ''}
	        });
	 }
})();