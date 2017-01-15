const ngMessages = require('angular-messages');

module.exports = angular.module('utm', [ngMessages])

.controller('utmCtrl', function ($scope, directService, $state, toastService) {
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
		toastService.showMess(`Пометка ${$scope.target == 'main' ? 'основных' : 'быстрых'} ссылок закончена`, `Отменить`)
			.then(resp => {
				if (resp === 'ok') {
					directService.restoreFromBackup();
				}
			});
	}
});
