const ngMessages = require('angular-messages');
const getUrlWithUtm = require('../../libs/getUrlWithUtm');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });

module.exports = angular.module('utm', [ngMessages])

.controller('utmCtrl', function ($scope, directService, $state, toastService) {
	if (!directService.getData().length) return $state.go('getDirect');
	$scope.isLoader = false;

	$scope.map = directService.getMap();
	$scope.previewData = {};

	for	(let c in $scope.map) {
		for	(let g in $scope.map[c].groups) {
			if ($scope.map[c].groups[g].fastLinks.length) {
				$scope.previewData.fastlink_name = $scope.map[c].groups[g].fastLinks[0].title;
				$scope.previewData.fastlink_url = $scope.map[c].groups[g].fastLinks[0].url;
			}
			if ($scope.map[c].groups[g].ads.length) {
				$scope.previewData.campaign_name = $scope.map[c].name;
				$scope.previewData.group_name = $scope.map[c].groups[g].name;
				$scope.previewData.ad_title = $scope.map[c].groups[g].ads[0].title;
				$scope.previewData.ad_url = $scope.map[c].groups[g].ads[0].url;
			}
		}
	}
	delete $scope.map;
	console.log($scope.previewData)

	$scope.target = 'main';
	$scope.utm = {
		utm_source: 'yandex.com',
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
		$state.go('menu.preview', {view: $scope.target === 'fast' ? 'bs' : 'ad'});
	}

	$scope.getSample = function() {
		let url = $scope.target == 'main' ? $scope.previewData.ad_url : $scope.previewData.fastlink_url;
		let utm = {};
		for (let item in $scope.utm) {
			utm[item] = $scope.utm[item]
				.replace(/\$\{campaign_name\}/g, slugify($scope.previewData.campaign_name))
				.replace(/\$\{group_name\}/g, slugify($scope.previewData.group_name))
				.replace(/\$\{ad_title\}/g, slugify($scope.previewData.ad_title))
				.replace(/\$\{fastlink_name\}/g, slugify($scope.previewData.fastlink_name))
				.toLowerCase();
		}
		return getUrlWithUtm(url, utm);
	};
});
