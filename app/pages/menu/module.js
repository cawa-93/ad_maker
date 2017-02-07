const routerModule = require('angular-ui-router').default;
const getDirectModule = require('../getDirect/module').name;
const previewModule = require('../preview/module').name;
const fastLinksModule = require('../fastLinks/module').name;
const utmModule = require('../utm/module').name;
const keywordsModule = require('../keywords/module').name;
const saveModule = require('../save/module').name;
const aboutModule = require('../about/module').name;

module.exports = angular.module('menu', [routerModule, getDirectModule, previewModule, fastLinksModule, utmModule, keywordsModule, saveModule, aboutModule])
.constant('pages', [{
		name: 'getDirect',
		templateUrl: 'pages/getDirect/index.html',
		url: "/getDirect",
	},{
		name: 'menu',
		templateUrl: 'pages/menu/index.html',
		abstract: true,
		url: "/menu",
	},{
		name: 'menu.preview',
		templateUrl: 'pages/preview/index.html',
		url: "/preview?view",
		title:'Обзор'
	},{
		name: 'menu.keywords',
		templateUrl: 'pages/keywords/index.html',
		url: "/keywords",
		title:'Ключевые слова'
	},{
		name: 'menu.fastLinks',
		templateUrl: 'pages/fastLinks/index.html',
		url: "/fastLinks",
		title:'Быстрые ссылки'
	},{
		name: 'menu.utm',
		templateUrl: 'pages/utm/index.html',
		url: "/utm",
		title:'Пометка ссылок'
	},{
		name: 'menu.save',
		templateUrl: 'pages/save/index.html',
		url: "/save",
		title:'Сохранить как...'
	},{
		name: 'menu.about',
		templateUrl: 'pages/about/index.html',
		url: "/about",
		title:'О программе'
	}]
)

.config(function (pages, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/getDirect');
	pages.forEach(p => $stateProvider.state(p));
})

.controller('MenuCtrl', function (pages, $state) {
	this.pages = pages.filter(page => !!page.title);
});
