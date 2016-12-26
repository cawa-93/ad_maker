require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');

const menuModule = require('./routes/menu/module');

angular.module('main', ['ngMaterial', menuModule])
.controller('MainCtrl', function () {

});

require('./services/direct');


// const {dialog, shell} = require('electron').remote;
// const fs = require('fs');
// const parseTSV = require('./libs/parseTSV');
// const stringifyTSV = require('./libs/stringifyTSV');
// const Template = require('./libs/Template.class');
// const openFile = require('./libs/openFile');

// angular.module('app', ['ngMaterial'])

// .controller('LoadTemplate', function ($scope) {
// 	$scope.stat = null;
// 	$scope.template = null;
// 	$scope.isLoad = false;
// 	$scope.isError = null;
// 	$scope.loaders = {
// 		keywords: false,
// 		direct: false,
// 		direct_result: false,
// 	}

// 	const openFileFilters = [
// 		{name: 'Images', extensions: ['txt', 'csv', 'tsv']}
// 	]

// 	$scope.setError = function (err) {
// 		console.error(err);
// 		dialog.showMessageBox({
// 			type: 'error',
// 			buttons: ['Ok'],
// 			title: "Ошибка",
// 			message: err,
// 			detail: 'Проверьте, что данный файл являеться текстовым'
// 		})
// 	}

// 	$scope.deleteTemplate = function () {
// 		$scope.stat = null;
// 		$scope.template = null;
// 		$scope.isError = null;
// 	}

// 	$scope.loadTemplate = function () {
// 		let file = dialog.showOpenDialog(openFileFilters);
// 		if (!file || !file[0]) return;
// 		$scope.loaders.keywords = true;
// 		$scope.loaders.direct = true;
// 		$scope.deleteTemplate();

// 		openFile(file[0]).then(file_content => {
// 			file_content = parseTSV(file_content);
// 			if (file_content.length < 2) {
// 				$scope.isError = true;
// 				$scope.loaders.keywords = false;
// 				$scope.loaders.direct = false;
// 				return;
// 			}

// 			let template_type = null;
// 			switch (file_content[2].length) {
// 				case 15: template_type = 'custom'; break;
// 				case 68: template_type = 'adwords'; break;
// 				case 42: template_type = 'direct'; break;
// 			}

// 			if (!template_type) {
// 				$scope.isError = true;
// 				$scope.loaders.keywords = false;
// 				$scope.loaders.direct = false;
// 				return;
// 			}

// 			$scope.template = new Template(file_content, template_type);
// 			$scope.stat = $scope.template.stat();
// 			$scope.loaders.keywords = false;
// 			$scope.loaders.direct = false;
// 			$scope.$apply();
// 		}).catch(err => $scope.setError(err))
// 	};

// 	$scope.generateDirect = function () {
// 		const file = dialog.showOpenDialog(openFileFilters);
// 		if (!file) return;
// 		$scope.loaders.direct_result = true;
// 		openFile(file[0]).then(file_content => {
// 			$scope.newDirect = $scope.template.generateDirect( parseTSV( file_content ) );
// 			$scope.loaders.direct_result = false;
// 			$scope.$apply();
// 			shell.beep();
// 		}).catch(err => $scope.setError(err))
// 	}

// 	$scope.saveDirect = function () {
// 		const file = dialog.showSaveDialog();
// 		fs.writeFileSync(file, stringifyTSV($scope.newDirect), 'utf8');
// 		shell.showItemInFolder(file);
// 	}

// 	$scope.openExternal = function (url) {
// 		shell.openExternal(url);
// 	}
	
// });
