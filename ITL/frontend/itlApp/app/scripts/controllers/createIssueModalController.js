var app = angular.module('itlApp');

app.controller('createIssueModalController', ['$scope', function($scope) {
	$scope.noteWrapper = {
		note : {}
	};
	$scope.issueWrapper = {
		issue : {}
	};
	$scope.formValidator = {
		form : {
			message : 'An error occurred. Please try again.'
		},
		Discovered__c : {
			message : 'Discovered is required'
		},
		Resolved__c : {
			message : 'Resolved is required'
		},
		Issue_Categories__c : {
			message : 'At least one category must be selected'
		},
		Details__c : {
			message : 'Details is required'
		}
	};

	$scope.$on('createIssueModal-broadcast', function(event, values) {
		$scope.clearValidation();
		$scope.noteWrapper = {
			note : {}
		};
		$scope.issueWrapper = {
			issue : {}
		};
		$scope.issueHelper = {};
		$scope.noteWrapper = values.noteWrapper;
		$scope.issueWrapper.issue.Plan_Notes__c = $scope.noteWrapper.note.Id;
		$scope.taskId = $scope.noteWrapper.note.Installation_Task__c;
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();

		if ($scope.issueWrapper.issue.Discovered__c) {
			if (!$scope.issueWrapper.issue.Discovered__c.match(/^((1[0-2])|(0[1-9])|([1-9]))\/((3[0-1])|([1-2][0-9])|(0[1-9])|([1-9]))\/(\d{4})$/g)) {
				$scope.formValidator.Discovered__c.error = true;
				$scope.formValidator.Discovered__c.message = 'Invalid MM/DD/YYYY date';
			} else {
				var discovered = new Date($scope.issueWrapper.issue.Discovered__c);
				if (!_.isDate(discovered)) {
					$scope.formValidator.Discovered__c.error = true;
					$scope.formValidator.Discovered__c.message = 'Invalid MM/DD/YYYY date';
				}
			}
		} else {
			$scope.formValidator.Discovered__c.error = true;
			$scope.formValidator.Discovered__c.message = 'Discovered is required';
		}
		if ($scope.issueWrapper.issue.Resolved__c) {
			if (!$scope.issueWrapper.issue.Resolved__c.match(/^((1[0-2])|(0[1-9])|([1-9]))\/((3[0-1])|([1-2][0-9])|(0[1-9])|([1-9]))\/(\d{4})$/g)) {
				$scope.formValidator.Resolved__c.error = true;
				$scope.formValidator.Resolved__c.message = 'Invalid MM/DD/YYYY date';
			} else {
				var discovered = new Date($scope.issueWrapper.issue.Resolved__c);
				if (!_.isDate(discovered)) {
					$scope.formValidator.Resolved__c.error = true;
					$scope.formValidator.Resolved__c.message = 'Invalid MM/DD/YYYY date';
				}
			}
		} else {
			$scope.formValidator.Resolved__c.error = true;
			$scope.formValidator.Resolved__c.message = 'Discovered is required';
		}
		$scope.formValidator.Issue_Categories__c.error = _.isEmpty($scope.issueWrapper.issue.Issue_Categories__c);
		$scope.formValidator.Details__c.error = _.isEmpty($scope.issueWrapper.issue.Details__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length == 0;
	};

	$scope.saveIssue = function() {
		if ($scope.validateForm()) {
			$scope.$emit('createIssue-emit', {
				taskId : $scope.taskId,
				issueWrapper : $scope.issueWrapper
			});
		}
	};

	$scope.cancel = function() {
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.updateCategories = function() {
		$scope.issueWrapper.issue.Issue_Categories__c = '';
		var categories = [];
		var helperKeys = _.keys($scope.issueHelper);
		_.each(helperKeys, function(key) {
			if ($scope.issueHelper[key]) {
				categories.push(key);
			}
		});
		$scope.issueWrapper.issue.Issue_Categories__c = categories.join(';');
	};

	$scope.$watchCollection('issueHelper', function() {
		$scope.updateCategories();
	});

	$scope.$watchCollection('issueWrapper.issue', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});
}]);