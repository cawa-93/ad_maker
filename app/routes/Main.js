const menuModule = require('./menu/module');

angular.module('main', ['ngMaterial', menuModule])
.controller('MainCtrl', function () {

});

require('../services/direct');
