var app = angular.module('itlApp');

app.filter("picklistTransform", [function() {
	return function(input) {
		var ret = input.split(';');
		return ret;
	};
}]);

app.filter("picklistNewLine", [function() {
	return function(input) {
		var ret = input.replace(/;/g, ',<br/>');
		return ret;
	};
}]);