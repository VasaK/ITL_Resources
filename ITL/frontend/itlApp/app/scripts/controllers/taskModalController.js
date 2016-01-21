var app = angular.module("itlApp");

app.controller("taskModalController", ["$scope", "componentService", function($scope, componentService) {
	$scope.modalTask = {};
	$scope.modalTaskHelper = {};
	$scope.modalTaskWrapper = {};
	$scope.modalTaskWrapperHelper = {};
	$scope.displayReusableAttributes = true;
	$scope.displaySpecificAttributes = false;
	$scope.formValidator = {
		form: {
			message: 'An error occurred. Please try again.'
		}
	};
	$scope.formValidatorReusableAttributes = {
		Task_Name__c: {
			message: 'Name is required'
		},
		Statuses__c: {
			message: 'Statuses is required'
		},
		Group_Responsible__c: {
			message: 'Group Responsible is required'
		},
		Editing_Roles__c: {
			message: 'At least one Editing Role is required'
		}
	};
	$scope.formValidatorSpecificAttributes = {
		targetDateTaskIndex: {
			message: 'Target Date Task is required'
		}
	};
	$scope.otherTasks = [];

	$scope.next = function() {
		if (!$scope.validateFormReusableAttributes()) {
			$scope.displayReusableAttributes = false;
			$scope.displaySpecificAttributes = true;
		}
	};

	$scope.previous = function() {
		$scope.displayReusableAttributes = true;
		$scope.displaySpecificAttributes = false;
	};

	$scope.$on("taskCreate-broadcast", function(event, values) {
		$scope.modalTask = {
			Phase_Template__c: values.phase.Id,
			Phase_Template__r: {
				Phase_Name__c: values.phase.Phase_Name__c
			}
		};
		$scope.modalTaskHelper = {};
		$scope.modalTaskWrapper = {
			association: {}
		};
		$scope.modalTaskWrapperHelper = {};
		if (values.taskList) {
			$scope.otherTasks = values.taskList;
		}
		$scope.clearValidation($scope.formValidator);
		$scope.clearValidation($scope.formValidatorReusableAttributes);
		$scope.clearValidation($scope.formValidatorSpecificAttributes);
		$scope.displayReusableAttributes = true;
		$scope.displaySpecificAttributes = false;
	});

	$scope.setEditingRolesCheckboxes = function() {
		if ($scope.modalTask.Editing_Roles__c) {
			var editingRoles = $scope.modalTask.Editing_Roles__c.split(';');
			_.each(editingRoles, function(role) {
				$scope.modalTaskHelper[role] = true;
			});
		}
	};

	$scope.$on("taskEdited-broadcast", function(event, values) {
		$scope.modalTask = values.task;
		$scope.modalTask.Phase_Template__r = {
			Phase_Name__c : values.phase.Phase_Name__c
		};
		$scope.modalTask.Editing_Roles__c = componentService.removeEscapedCharacters($scope.modalTask.Editing_Roles__c);
		$scope.modalTask.Task_Name__c = componentService.removeEscapedCharacters($scope.modalTask.Task_Name__c);
		$scope.modalTask.Description__c = componentService.removeEscapedCharacters($scope.modalTask.Description__c);
		$scope.setEditingRolesCheckboxes();
		$scope.modalTaskWrapper = values.taskWrapper;
		if (values.taskList) {
			$scope.otherTasks = _.reject(values.taskList, function(taskWrapper) {
				return taskWrapper.templateOrderIndex == $scope.modalTaskWrapper.templateOrderIndex;
			});
		}
		$scope.clearValidation($scope.formValidator);
		$scope.clearValidation($scope.formValidatorReusableAttributes);
		$scope.clearValidation($scope.formValidatorSpecificAttributes);
		if (values.skipToSpecificAttributes) {
			$scope.displayReusableAttributes = false;
			$scope.displaySpecificAttributes = true;
		} else {
			$scope.displayReusableAttributes = true;
			$scope.displaySpecificAttributes = false;
		}
		if (!_.isUndefined($scope.modalTaskWrapper.prereqTaskIndex)) {
			$scope.modalTaskWrapper.prereqTaskIndex = "" + $scope.modalTaskWrapper.prereqTaskIndex;
		}
		if (!_.isUndefined($scope.modalTaskWrapper.targetDateTaskIndex)) {
			$scope.modalTaskWrapper.targetDateTaskIndex = "" + $scope.modalTaskWrapper.targetDateTaskIndex;
		}
	});

	$scope.$on("taskModal-displayError", function(event, values) {
		$scope.displayRemoteError(values.message);
	});

	$scope.clearValidation = function(formValidator) {
		_.each(_.values(formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateFormReusableAttributes = function() {
		$scope.clearValidation($scope.formValidator);
		$scope.clearValidation($scope.formValidatorReusableAttributes);
		$scope.formValidatorReusableAttributes.Task_Name__c.error = _.isEmpty($scope.modalTask.Task_Name__c);
		$scope.formValidatorReusableAttributes.Statuses__c.error = _.isEmpty($scope.modalTask.Statuses__c);
		$scope.formValidatorReusableAttributes.Group_Responsible__c.error = _.isEmpty($scope.modalTask.Group_Responsible__c);
		$scope.formValidatorReusableAttributes.Editing_Roles__c.error = _.isEmpty($scope.modalTask.Editing_Roles__c);

		var errors = _.where(_.values($scope.formValidatorReusableAttributes), {error:true});
		return errors.length > 0;
	};

	$scope.validateFormSpecificAttributes = function() {
		$scope.clearValidation($scope.formValidator);
		$scope.clearValidation($scope.formValidatorSpecificAttributes);
		if ($scope.modalTaskWrapper.association.Target_Date_Based_On__c == 'Task Completion Date') {
			$scope.formValidatorSpecificAttributes.targetDateTaskIndex.error = _.isEmpty($scope.modalTaskWrapper.targetDateTaskIndex);
		}

		var errors = _.where(_.values($scope.formValidatorSpecificAttributes), {error:true});
		return errors.length > 0;
	};

	$scope.handleSaveModalTask = function() {
		if (!$scope.validateFormSpecificAttributes()) {
			$scope.saveModalTask();
		}
	};

	$scope.displayRemoteError = function(message) {
		$scope.formValidator.form.message = 'An error occurred. Please try again.';
		if (message) {
			$scope.formValidator.form.message = message;
		}
		$scope.formValidator.form.error = true;
		$scope.helper.formReady = true;
	};

	$scope.saveModalTask = function() {
		if ($scope.modalTask.Id) {
			$scope.$emit("saveModalTask", {
				task: $scope.modalTask,
				taskWrapper: $scope.modalTaskWrapper
			});
		} else {
			$scope.$emit("createModalTask", {
				task: $scope.modalTask,
				taskWrapper: $scope.modalTaskWrapper
			});
		}
	};

	$scope.cancelModalTask = function() {
		$scope.modalTask = {};
		$scope.modalTaskHelper = {};
		$scope.modalTaskWrapper = {
			association: {}
		};
		$scope.modalTaskWrapperHelper = {};
		$scope.otherTasks = [];
		$scope.displayReusableAttributes = true;
		$scope.displaySpecificAttributes = false;
		$scope.$emit("cancelModalTask");
	};

	$scope.updateEditingRoles = function() {
		$scope.modalTask.Editing_Roles__c = '';
		var editingRoles = [];
		var helperKeys = _.keys($scope.modalTaskHelper);
		_.each(helperKeys, function(key) {
			if ($scope.modalTaskHelper[key]) {
				editingRoles.push(key);
			}
		});
		$scope.modalTask.Editing_Roles__c = editingRoles.join(';');
	};

	$scope.$watchCollection('modalTaskHelper', function() {
		$scope.updateEditingRoles();
	});

}]);