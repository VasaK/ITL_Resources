var app = angular.module('itlApp');

app.filter("convertToDateString", [function() {
	return function(input) {
		var dateString = '';
		if (input) {
			var convertedDate = new Date(input);
			dateString = (convertedDate.getUTCMonth() + 1) + '/' + convertedDate.getUTCDate() + '/' + convertedDate.getUTCFullYear();
		}
		return dateString;
	};
}]);