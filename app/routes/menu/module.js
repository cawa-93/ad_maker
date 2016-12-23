const routerModule = require('angular-ui-router').default;
const getDirectModule = require('../getDirect/module');
const previewModule = require('../preview/module');
const fastLinksModule = require('../fastLinks/module');

module.exports = angular.module('menu', [routerModule, getDirectModule, previewModule, fastLinksModule])
.constant('pages', [{
		name: 'getDirect',
		templateUrl: 'routes/getDirect/index.html',
		url: "/getDirect",
	},{
		name: 'menu',
		templateUrl: 'routes/menu/index.html',
		abstract: true,
		url: "/menu",
	},{
		name: 'menu.preview',
		templateUrl: 'routes/preview/index.html',
		url: "/preview",
		title:'Просмотр'
	},{
		name: 'menu.fastLinks',
		templateUrl: 'routes/fastLinks/index.html',
		url: "/fastLinks",
		title:'Быстрые ссылки'
	}]
)

.config(function (pages, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/getDirect');
	pages.forEach(p => $stateProvider.state(p));
})

.controller('MenuCtrl', function (pages, $state) {
	this.pages = pages.filter(page => !!page.title);

	this.go = function (page) {
		$state.go(page.name);
	}
})

.name;
