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
	
	$scope.getWithoutQuotes = str => getWithoutQuotes(str);
	// $scope.selectedCampain = null;
	// $scope.selectedGroup = null;
	$scope.campains = [];
	directService.getData().forEach((row, index) => {
		if (index < 3 || !row || !row[8] || !row[3]) return;
		const campain_name = getWithoutQuotes(row[8]);
		const group_name = getWithoutQuotes(row[3]);
		const keyword = getWithoutQuotes(row[10]);
		const ad = {
			title: getWithoutQuotes(row[12]),
			desc: getWithoutQuotes(row[13]),
			url: getWithoutQuotes(row[14]),
		}

		const fastLinks = [];
		let fastLinksData = {
			titles: getWithoutQuotes(row[22]).split('||'),
			urls: getWithoutQuotes(row[23]).split('||'),
			descs: getWithoutQuotes(row[24]).split('||'),
		}
		fastLinksData.urls.forEach((url, index) => {
			if (url && fastLinksData.titles[index] && fastLinksData.descs[index]) {
				fastLinks.push({
					title: fastLinksData.titles[index],
					url: url,
					desc:  fastLinksData.descs[index]
				})
			}
		});

		let campain = getCampain(campain_name);
		if (campain === undefined) {
			campain = {
				name: campain_name,
				groups: []
			};
			$scope.campains.push(campain)
		} 
		
		let group = getGroup(campain, group_name);
		if (group === undefined) {
			group = {
				name: group_name,
				keywords: [],
				ads: [],
				fastLinks: [],
			};
			campain.groups.push(group)
		}

		group.ads.push(ad);
		if (keyword) group.keywords.push(keyword);
		if (angular.isArray(fastLinks) && fastLinks.length) group.fastLinks = fastLinks;
	})

	$scope.campains.forEach(campain => {
		campain.groups.forEach(group => {
			group.ads.forEach(ad => {
				$scope.data.push({
					campain: campain.name,
					group: group.name,
					ad_title: ad.title,
					ad_desc: ad.desc,
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

	function getCampain (camp_name) {
		return $scope.campains.find(c => c.name == camp_name);
	}

	function getGroup (campain, group_name) {
		return campain.groups.find(g => g.name == group_name);
	}
});
