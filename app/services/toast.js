module.exports = angular.module('main')
.service('toastService', function ($mdToast) {
	this.showMess = function(text, action) {
		let toast = $mdToast.simple().textContent(text).position('top right').hideDelay(5000);
		if (action) toast.action(action).highlightAction(true);
		return $mdToast.show(toast);
	}
})
