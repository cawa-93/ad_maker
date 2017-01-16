const {app, shell} = require('electron').remote;

module.exports = angular.module('about', [])

.controller('aboutCtrl', function ($scope, directService, $state) {
	if (!directService.getData().length) return $state.go('getDirect');

	$scope.app = {
		name: app.getName(),
		version: app.getVersion(),
	}

	$scope.openExternal = shell.openExternal;
});
