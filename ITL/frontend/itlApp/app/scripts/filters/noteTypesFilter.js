var app = angular.module('itlApp');

app.filter("abbreviateNoteTypes", [function() {
	return function(input) {
		var types = '';
		if (input) {
			var typeValues = [];
			_.each(input, function(textWrapper) {
				typeValues.push(textWrapper.text.Type__c.substring(0, 1));
			});
			typeValues = _.sortBy(typeValues, function(letter) {return letter;});
			typeValues = _.uniq(typeValues);
			types = typeValues.join(',');
		}
		return types;
	};
}]);