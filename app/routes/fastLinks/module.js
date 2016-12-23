module.exports = angular.module('fastLinks', [])

.controller('fastLinksCtrl', function ($scope, directService, $state) {
	if (!directService.getData().length) return $state.go('getDirect');

	$scope.fastLinks = [];
	$scope.setFastLinks = function () {
		console.log($scope.fastLinks);
	}
})

.name;
