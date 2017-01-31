const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');

const menuModule = require('./pages/menu/module').name;
const ngTable = require('angular-material-data-table');


angular.module('main', ['ngMaterial', menuModule, ngTable])

.controller('MainCtrl', function ($mdToast) {
	let isShow = false;
	ipcRenderer.on("update-progress", (event, percent) => {
		if (percent < 100 && !isShow) {
			isShow = true;
			$mdToast.show({
				hideDelay   : 0,
				position    : 'bottom left',
				controller  : 'ToastUpdateCtrl',
				templateUrl : 'toast-update.html'
			});
		}
	})
})

.controller('ToastUpdateCtrl', function ($scope, $mdToast) {
	$scope.determinateValue = 0;
	ipcRenderer.on("update-progress", (event, percent) => {
		if (percent < 100) {
			$scope.determinateValue = percent;
			$scope.$apply();
		} else {
			$mdToast.hide();
		}
	});

	$scope.closeToast = () => {
		$mdToast.hide()
	}
})

.controller('helpCtrl', function ($scope, $mdDialog, $state, $transitions) {
	$scope.helpPath = '';
	$scope.isDisabled = true;

	$transitions.onSuccess({to: '**'}, (...args) => {
		$scope.helpPath = $state.current.templateUrl.replace('index', 'help')
		$scope.isDisabled = !fs.existsSync(path.join(__dirname , $scope.helpPath));
	});

	$scope.show = function () {
		console.log($scope.helpPath)
		$mdDialog.show({
			controller: 'modalCtrl',
			templateUrl: $scope.helpPath,
			clickOutsideToClose:true,
		})
	}
})

.controller('modalCtrl', function ($scope, $mdDialog) {
		$scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
})
;


require('./services/direct');
require('./services/toast');
