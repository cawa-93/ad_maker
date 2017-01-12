const ngMessages = require('angular-messages');

module.exports = angular.module('utm', [ngMessages])

.controller('utmCtrl', function ($scope, directService, $state, $mdToast) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;

	$scope.target = 'main';
	$scope.utm = {
		utm_source: 'yandex',
		utm_medium: 'cpc',
		utm_campaign: '${campaign_name}',
		utm_content: '${group_name}'
	};
	$scope.setUtm = function () {
		$scope.isLoader = true;
		directService.setUtm($scope.target, $scope.utm);
		$scope.isLoader = false;
		$mdToast.show( $mdToast.simple().textContent(`Пометка ${$scope.target == 'main' ? 'основных' : 'быстрых'} ссылок закончена`).position('top right') );
	}
});
