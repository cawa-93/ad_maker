const getWithoutQuotes = require('../../libs/getWithoutQuotes');
module.exports = angular.module('preview', [])

.controller('previewCtrl', function ($scope, directService, $state) {
	if (!directService.getData().length) return $state.go('getDirect');

	$scope.direct = directService.getData();
	$scope.selectedCampain = null;
	$scope.selectedGroup = null;
	$scope.campains = {};
	$scope.direct.forEach((row, index) => {
		if (index < 3 || !row[8] || !row[3]) return;

		const campain = getWithoutQuotes(row[8]);
		const group = getWithoutQuotes(row[3]);
		const keyword = getWithoutQuotes(row[10]);
		const ad = [getWithoutQuotes(row[12]), getWithoutQuotes(row[13]), getWithoutQuotes(row[14])];

		const fastLinksData = {
			titles: getWithoutQuotes(row[22]).split('||'),
			urls: getWithoutQuotes(row[23]).split('||'),
			descs: getWithoutQuotes(row[24]).split('||'),
		}

		if (!$scope.campains[campain]) $scope.campains[campain] = {};
		if (!$scope.campains[campain][group]) $scope.campains[campain][group] = {
			ads: [],
			keywords: [],
			fastLinks: [],
		};
		$scope.campains[campain][group].keywords.push(keyword);
		if ($scope.campains[campain][group].ads.findIndex(a => a[0] == ad[0]) == -1){
			$scope.campains[campain][group].ads.push(ad);
		}
		for (let i = 0; i<4;i++)
			if ($scope.campains[campain][group].fastLinks.findIndex(a => a[0] == fastLinksData.titles[i]) == -1)
				$scope.campains[campain][group].fastLinks.push([fastLinksData.titles[i], fastLinksData.urls[i], fastLinksData.descs[i]]);
	})

	$scope.getCampainNames = () => Object.keys($scope.campains);
	$scope.openCampain = campain => {$scope.selectedCampain = campain; $scope.selectedGroup = null};
	$scope.openGroup = group => $scope.selectedGroup = group;
	$scope.getGroupsNames = () => Object.keys($scope.campains[$scope.selectedCampain]);
	console.log($scope.direct);
})

.name;
