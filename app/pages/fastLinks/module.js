const ngMessages = require('angular-messages');
const {dialog} = require('electron').remote;
const mime = require('mime-types');
const openFile = require('../../libs/openFile');
const parseTSV = require('../../libs/parseTSV');

module.exports = angular.module('fastLinks', [ngMessages])

.controller('fastLinksCtrl', function ($scope, directService, $state, toastService) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;
	$scope.target = 'custom';

	$scope.setFastLinks = function () {

		let file = dialog.showOpenDialog();
		if (!file || !file[0]) return toastService.showMess('Файл не выбран'); 
		file = file[0];
		if (!mime.lookup(file) || mime.lookup(file).split('/')[0] != 'text') return toastService.showMess('Данный файл не может быть прочитан');
		
		$scope.isLoader = true;
		openFile(file).then(file_content => {
			file_content = parseTSV(file_content);
			dialog.showMessageBox({
				type: 'question',
				buttons: ['No', 'Yes'],
				defaultId: 0,
				title: 'Подтвердите добавление быстрых ссылок',
				message: 'Добавить быстрые ссылки в кампании?',
				// detail: 'Обратите внимание, что новые ключевые слова будут добавлены к уже существующим и НЕ БУДУТ перезаписаны',
				cancelId: 0,
			}, resp => {
				if (!resp) return;
				directService.setFastLinks(file_content, $scope.target);
				$scope.isLoader = false;
				toastService.showMess(`Быстрые ссылки добавлены`, `Отменить`).then(resp => {
					if (resp === 'ok') {
						directService.restoreFromBackup();
					}
				});
				$state.go('menu.preview', {view: 'bs'});
			})
		})
		.catch(e => {
			console.error(e);
			toastService.showMess( e.toString() || 'Ошибка')
		})
	}
});
