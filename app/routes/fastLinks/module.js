const ngMessages = require('angular-messages');

module.exports = angular.module('fastLinks', [ngMessages])

.controller('fastLinksCtrl', function ($scope, directService, $state, $mdToast) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;

	$scope.fastLinks = [];
	$scope.setFastLinks = function () {
		$scope.isLoader = true;
		directService.setFastLinks($scope.fastLinks);
		$scope.isLoader = false;
		$mdToast.show( $mdToast.simple().textContent('Быстрые ссылки вставлены').position('top right') );
	}
})

.name;
