const {dialog, shell} = require('electron').remote;
const fs = require('fs');
const stringifyTSV = require('../../libs/stringifyTSV');
module.exports = angular.module('save', [])

.controller('saveCtrl', function ($scope, directService, $mdToast, $state) {
	if (!directService.getData().length) return $state.go('getDirect');
	
	$scope.saveAs = function () {
		let file = dialog.showSaveDialog({
			defaultPath: 'result-direct.csv'
		});
		if (!file) return;

		try {
			fs.writeFileSync(file, stringifyTSV(directService.getData()), 'utf8');
			shell.showItemInFolder(file);
		} catch (e) {
			$scope.showMess(e.toString());
		}
	}

	$scope.showMess = function(text) {
		$mdToast.show( $mdToast.simple().textContent(text).position('top right') );
	}
})

.name;
