var app = angular.module("itlApp");

app.service("dateService", [function() {
	this.convertToSFDCSafeString = function(dateValue) {
		return Date.parse(dateValue + ' 00:00:00 GMT');
	};
	this.convertToDateString = function(milliseconds) {
		var dateString = '';
		if (milliseconds) {
			var convertedDate = new Date(milliseconds);
			dateString = (convertedDate.getUTCMonth() + 1) + '/' + convertedDate.getUTCDate() + '/' + convertedDate.getUTCFullYear();
		}
		return dateString;
	};
}]);