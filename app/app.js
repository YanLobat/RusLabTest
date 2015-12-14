(function () {
	'use strict';
	//подключение модулей различных страниц
	angular
		.module('RusLabTest', [
				'RusLabTest.goods',
				'ui.router',
				'btford.socket-io'
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
		.module('RusLabTest')
		.factory('mySocket', function (socketFactory) {
		  return socketFactory();
		});
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsCtrl', GoodsCtrl);
	GoodsCtrl.$inject = ['$scope','$rootScope','$log','$http','mySocket'];

	function GoodsCtrl($scope,$rootScope,$log,$http,mySocket){
		var vm = this;
		vm.goods = [];
		mySocket.forward('json', $scope);
	    $scope.$on('socket:json', function (ev, data) {
	      if (data == 'update'){
	      	vm.getJSON();
	      }
	    });
		vm.getJSON = function(){
			$http.get("/app/test.json")
    		.then(function(response) {
    			vm.goods = response.data.items;
    		});
		};
		vm.like = function(id){
			mySocket.emit('like',id);
		};
		vm.dislike = function(id){
			mySocket.emit('dislike',id);
		};
		$rootScope.curPath = 'goods';//что-то вроде глобальной переменной для использования во вьюхах
	}
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsLikesCtrl', GoodsLikesCtrl);
	GoodsLikesCtrl.$inject = ['$scope','$rootScope','$log','$http','mySocket'];

	function GoodsLikesCtrl($scope,$rootScope,$log,$http,mySocket){
		var vm = this;
		vm.goods = [];
		mySocket.forward('sendlikes', $scope);
		$scope.$on('socket:sendlikes', function (ev, data) {
	        for (var i = 0; i < vm.goods.length; i++){
		      	if (data.indexOf(vm.goods[i].id) != -1){
		      		vm.goods[i].forlike = true;
		      		console.log(vm.goods[i]);
		      	}
	        }
	    });
	    mySocket.forward('json', $scope);
	    $scope.$on('socket:json', function (ev, data) {
	      if (data == 'update'){
	      	vm.getJSON();
	      }
	    });
	    vm.isliked = function(good){
	    	if (good.forlike)
	    		return true;
	    	return false;
	    };
		vm.getJSON = function(){
			$http.get("/app/test.json")
    		.then(function(response) {
    			vm.goods = response.data.items;
    		});
    		mySocket.emit('getlikes','msg');
		};
		vm.like = function(id){
			mySocket.emit('like',id);
		};
		vm.dislike = function(id){
			mySocket.emit('dislike',id);
		};
		$rootScope.curPath = 'goods-likes';//что-то вроде глобальной переменной для использования во вьюхах
	}
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsDislikesCtrl', GoodsDislikesCtrl);
	GoodsDislikesCtrl.$inject = ['$scope','$rootScope','$log','$http','mySocket'];

	function GoodsDislikesCtrl($scope,$rootScope,$log,$http,mySocket){
		var vm = this;
		vm.goods = [];
		mySocket.forward('senddislikes', $scope);
		$scope.$on('socket:senddislikes', function (ev, data) {
	        for (var i = 0; i < vm.goods.length; i++){
		      	if (data.indexOf(vm.goods[i].id) != -1){
		      		vm.goods[i].fordislike = true;
		      		console.log(vm.goods[i]);
		      	}
	        }
	    });
	    mySocket.forward('json', $scope);
	    $scope.$on('socket:json', function (ev, data) {
	      if (data == 'update'){
	      	vm.getJSON();
	      }
	    });
	    vm.isdisliked = function(good){
	    	if (good.fordislike)
	    		return true;
	    	return false;
	    };
		vm.getJSON = function(){
			$http.get("/app/test.json")
    		.then(function(response) {
    			vm.goods = response.data.items;
    		});
    		mySocket.emit('getdislikes','msg');
		};
		vm.like = function(id){
			mySocket.emit('like',id);
		};
		vm.dislike = function(id){
			mySocket.emit('dislike',id);
		};
		$rootScope.curPath = 'goods-likes';//что-то вроде глобальной переменной для использования во вьюхах
	}
})();
;(function(){	
	'use strict';
	angular
		.module('RusLabTest.goods')
		.controller('GoodsItemCtrl', GoodsItemCtrl)
	GoodsItemCtrl.$inject = ['$scope','$rootScope','$log','$http','$state','$stateParams','mySocket'];

	function GoodsItemCtrl($scope,$rootScope,$log,$http,$state,$stateParams,mySocket){
		var vm = this;
		vm.items = [];
		vm.getItem = function(){
			vm.item = $stateParams.good;
			if (!vm.item){
				$http.get("/app/test.json")
	    		.then(function(response) {
	    			vm.items = response.data.items;
	    			for (var i = 0; i < vm.items.length; i++){
	    				if($stateParams.id == vm.items[i].id){
	    					vm.item = vm.items[i];
	    					return;
	    				}
	    			}
	    		});
			}
			mySocket.emit('seen',vm.item.id);
			console.log('sent');
		};
		vm.setCover = function(src){
			vm.item.cover = src;
		};
		mySocket.forward('seen', $scope);
	    $scope.$on('socket:seen', function (ev, data) {
	      	alert('Вы посмотрели все товары');
	      	return;
	    });
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
	        .state('goods.likes', {
	        	url: "/likes",
	        	templateUrl: "app/goods/goods-likes.html",
	        })
	        .state('goods.dislikes', {
	        	url: "/dislikes",
	        	templateUrl: "app/goods/goods-dislikes.html",
	        })
	        .state('goods.item', {
	         	url: "/:id",
	            templateUrl: "app/goods/goods-item.html",
	            controller: 'GoodsItemCtrl',
	            controllerAs: 'vm',
	            params: {good: ''}
	        });
	 }
})();