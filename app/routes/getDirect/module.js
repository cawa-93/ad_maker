const {dialog} = require('electron').remote;
const mime = require('mime-types');
const openFile = require('../../libs/openFile');
const parseTSV = require('../../libs/parseTSV');
module.exports = angular.module('getDirect', [])

.controller('getDirect', function ($scope, directService, $mdToast, $state) {
	$scope.isLoader = false;
	$scope.loadDirect = function () {
		let file = dialog.showOpenDialog();
		if (!file || !file[0]) return $scope.showMess('Файл не выбран'); 
		file = file[0];
		if (!mime.lookup(file) || mime.lookup(file).split('/')[0] != 'text') return $scope.showMess('Данный файл не может быть прочитан');
		
		$scope.isLoader = true;
		openFile(file).then(file_content => {
			directService.setData( parseTSV(file_content) );
			$scope.isLoader = false;
			$state.go('menu.preview');
		})
		.catch(e => {
			console.error(e);
			$scope.showMess( e.toString() || 'Ошибка')
		})

	}

	$scope.showMess = function(text) {
		$mdToast.show( $mdToast.simple().textContent(text).position('top right') );
	}
})

.name;
