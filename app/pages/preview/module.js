const getWithoutQuotes = require('../../libs/getWithoutQuotes');
const {shell} = require('electron').remote;
module.exports = angular.module('preview', [])

.filter('view', function() {
  return function(input, view) {
		switch (view) {
			case 'ad' : return input.filter(row => row.ad_title && row.ad_desc && row.ad_url);
			case 'keyword' : return input.filter(row => row.keyword);
			case 'bs' : return input.filter(row => row.fastLink_title && row.fastLink_desc && row.fastLink_url);
		}
		return input;
  };
})

.controller('previewCtrl', function ($scope, directService, $state) {
	if (!directService.getData().length) return $state.go('getDirect');

	$scope.data = [];
	$scope.query = {
		order: 'campain',
		view: 'ad',
		search: '',
	};
	$scope.setSearch = str => $scope.query.search = str;
	$scope.openExternal = shell.openExternal;
	$scope.getWithoutQuotes = getWithoutQuotes;

	directService.getMap().forEach(campain => {
		campain.groups.forEach(group => {
			group.ads.forEach(ad => {
				$scope.data.push({
					campain: campain.name,
					group: group.name,
					ad_title: ad.title,
					ad_desc: ad.desc,
					ad_ancor: ad.ancor,
					ad_url: ad.url,
				})
			})
			group.keywords.forEach(keyword => {
				$scope.data.push({
					campain: campain.name,
					group: group.name,
					keyword,
				})
			})
			group.fastLinks.forEach(link => {
				$scope.data.push({
					campain: campain.name,
					group: group.name,
					fastLink_title: link.title,
					fastLink_url: link.url,
					fastLink_desc: link.desc,
				})
			})
		})
	})
});
