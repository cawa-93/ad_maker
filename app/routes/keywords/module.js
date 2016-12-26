const {dialog} = require('electron').remote;
const mime = require('mime-types');
const openFile = require('../../libs/openFile');
const parseTSV = require('../../libs/parseTSV');
const parseFromAdwords = require('../../libs/parseFromAdwords');
const parseFromCustom = require('../../libs/parseFromCustom');

module.exports = angular.module('keywords', [])
.controller('keywordsCtrl', function ($scope, directService, $state, $mdToast) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;
	$scope.keywords = [];

	$scope.parseKeywords = () => {
		let file = dialog.showOpenDialog();
		if (!file || !file[0]) return $scope.showMess('Файл не выбран'); 
		file = file[0];
		if (!mime.lookup(file) || mime.lookup(file).split('/')[0] != 'text') return $scope.showMess('Данный файл не может быть прочитан');
		
		$scope.isLoader = true;
		// $scope.$apply();
		openFile(file).then(file_content => {
			file_content = parseTSV(file_content);
			if (file_content[1].length !== 3) $scope.keywords = parseFromAdwords(file_content);
			else $scope.keywords = parseFromCustom(file_content);
			$scope.isLoader = false;
			$scope.$apply();
		})
		.catch(e => {
			console.error(e);
			$scope.showMess( e.toString() || 'Ошибка')
		})
	}


	$scope.setKeywords = () => {
		dialog.showMessageBox({
			type: 'question',
			buttons: ['No', 'Yes'],
			defaultId: 0,
			title: 'Подтвердите добавление ключевых слов',
			message: 'Это действие не возможно отменить',
			detail: 'Обратите внимание, что новые ключевые слова будут добавлены к уже существующим и НЕ БУДУТ перезаписаны',
			cancelId: 0,
		}, resp => {
			if (!resp) return;
			directService.setKeywords($scope.keywords);
			$scope.keywords = [];
			$scope.showMess(`Ключевые слова добавлены`);
		})
	}

	$scope.showMess = function(text) {
		$mdToast.show( $mdToast.simple().textContent(text).position('top right') );
	}
})

.name;
