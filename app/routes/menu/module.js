const routerModule = require('angular-ui-router').default;
const getDirectModule = require('../getDirect/module');
const previewModule = require('../preview/module');
const fastLinksModule = require('../fastLinks/module');
const utmModule = require('../utm/module');
const keywordsModule = require('../keywords/module');
const saveModule = require('../save/module');

module.exports = angular.module('menu', [routerModule, getDirectModule, previewModule, fastLinksModule, utmModule, keywordsModule, saveModule])
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
		name: 'menu.keywords',
		templateUrl: 'routes/keywords/index.html',
		url: "/keywords",
		title:'Ключевые слова'
	},{
		name: 'menu.fastLinks',
		templateUrl: 'routes/fastLinks/index.html',
		url: "/fastLinks",
		title:'Быстрые ссылки'
	},{
		name: 'menu.utm',
		templateUrl: 'routes/utm/index.html',
		url: "/utm",
		title:'Пометка ссылок'
	},{
		name: 'menu.save',
		templateUrl: 'routes/save/index.html',
		url: "/save",
		title:'Сохранить'
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
