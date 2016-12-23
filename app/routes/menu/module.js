const routerModule = require('angular-ui-router').default;
const getDirectModule = require('../getDirect/module');
const previewModule = require('../preview/module');

module.exports = angular.module('menu', [routerModule, getDirectModule, previewModule])
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
	}]
)

.config(function (pages, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/getDirect');
	pages.forEach(p => $stateProvider.state(p));
})

.controller('MenuCtrl', function (pages) {
	this.pages = pages.filter(page => !!page.title);

	this.go = function (page) {
		console.log(page)
	}
})

.name;
