var app = angular.module('itlApp');

app.filter("changeTaskNumberToName", [function() {
	return function(input, taskList) {
		var inputNum = parseInt(input, 10);
		var tasks = _.where(taskList, {templateOrderIndex: inputNum});
		return tasks[0].association.Task_Template__r.Task_Name__c;
	};
}]);