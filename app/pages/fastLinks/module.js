const ngMessages = require('angular-messages');
const {dialog} = require('electron').remote;
const mime = require('mime-types');
const openFile = require('../../libs/openFile');
const parseTSV = require('../../libs/parseTSV');

module.exports = angular.module('fastLinks', [ngMessages])

.controller('fastLinksCtrl', function ($scope, directService, $state, $mdToast, $mdBottomSheet) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;
	$scope.target = 'custom';

	$scope.setFastLinks = function () {

		let file = dialog.showOpenDialog();
		if (!file || !file[0]) return $scope.showMess('Файл не выбран'); 
		file = file[0];
		if (!mime.lookup(file) || mime.lookup(file).split('/')[0] != 'text') return $scope.showMess('Данный файл не может быть прочитан');
		
		$scope.isLoader = true;
		openFile(file).then(file_content => {
			file_content = parseTSV(file_content);
			directService.setFastLinks(file_content, $scope.target);
			$scope.isLoader = false;
			$scope.$apply();
		})
		.catch(e => {
			console.error(e);
			$scope.showMess( e.toString() || 'Ошибка')
		})


		// $scope.isLoader = true;
		// directService.setFastLinks($scope.fastLinks);
		// $scope.isLoader = false;
		// $mdToast.show( $mdToast.simple().textContent('Быстрые ссылки вставлены').position('top right') );
	}

	$scope.showMess = function(text) {
		$mdToast.show( $mdToast.simple().textContent(text).position('top right') );
	}
});
