module.exports = angular.module('main')

.service('directService', function () {
	let _data = [];

	this.setData = (data) => {
		_data = data;
		return this;
	}

		this.getData = () => {
		return _data;
	}

})

.name;
