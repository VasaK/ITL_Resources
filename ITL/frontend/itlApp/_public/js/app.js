var app = angular.module('itlApp', ['ngRoute', 'textAngular', 'naif.base64', 'ngMessages', 'slick-angular-validation']).config(function($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
        taOptions.toolbar = [
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'insertLink']
        ];
        return taOptions;
    }]);
});

app.config(function($routeProvider) {
    if (resourceUrl === "{!$Resource.ITL_Resource}") {
        resourceUrl = "";
    }
});
var app = angular.module('itlApp');

app.controller('appendNoteModalController', ['$scope', function($scope) {
	$scope.noteWrapper = {
		note : {}
	};
	$scope.textWrapper = {
		text : {}
	};
	$scope.formValidator = {
		form : {
			message : 'An error occurred. Please try again.'
		},
		Type__c : {
			message : 'Type is required'
		},
		Notes_Text_Score__c : {
			message : 'Score is required'
		},
		Notes__c : {
			message : 'Notes is required'
		}
	};

	$scope.$on('appendNoteModal-broadcast', function(event, values) {
		$scope.clearValidation();
		$scope.noteWrapper = {
			note : {}
		};
		$scope.textWrapper = {
			text : {}
		};
		$scope.noteWrapper = values.noteWrapper;
		$scope.taskId = $scope.noteWrapper.note.Installation_Task__c;
		$scope.textWrapper.text.Plan_Notes__c = $scope.noteWrapper.note.Id;
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();

		$scope.formValidator.Type__c.error = _.isEmpty($scope.textWrapper.text.Type__c);
		$scope.formValidator.Notes_Text_Score__c.error = _.isEmpty($scope.textWrapper.text.Notes_Text_Score__c);
		$scope.formValidator.Notes__c.error = _.isEmpty($scope.textWrapper.text.Notes__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length == 0;
	};

	$scope.saveText = function() {
		if ($scope.validateForm()) {
			$scope.$emit('createText-emit', {
				taskId : $scope.taskId,
				textWrapper : $scope.textWrapper
			});
		}
	};

	$scope.cancel = function() {
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.$watchCollection('textWrapper.text', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});
}]);
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
var app = angular.module('itlApp');

app.controller('createNoteModalController', ['$scope', function($scope) {
	$scope.noteReasonOptionsTemplate = resourceUrl + '/partials/noteReasonOptions.html';
	$scope.xlinkHelper = {
		search : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#search",
		down : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#down",
		contact : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#contact",
		close : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#close"
	};
	$scope.displayContactLabel = false;
	$scope.displayContactValue = true;
	$scope.contactName = '';
	$scope.contactSearch = '';
	$scope.noteWrapper = {
		note : {}
	};
	$scope.textWrapper = {
		text : {}
	};
	$scope.formValidator = {
		form : {
			message : 'An error occurred. Please try again.'
		},
		Subject__c : {
			message : 'Subject is required'
		},
		Reason__c : {
			message : 'Reason is required'
		},
		Expire_on__c : {
			message : 'Date must be in the future'
		},
		Contact__c : {
			message : 'Please select a valid contact from the list.'
		},
		Type__c : {
			message : 'Type is required'
		},
		Notes_Text_Score__c : {
			message : 'Score is required'
		},
		Notes__c : {
			message : 'Notes is required'
		}
	};

	$scope.$on('createNoteModal-broadcast', function(event, values) {
		$scope.clearValidation();
		$scope.displayContactLabel = false;
		$scope.displayContactValue = true;
		$scope.contactName = '';
		$scope.contactSearch = '';
		$scope.noteWrapper = {
			note : {}
		};
		$scope.textWrapper = {
			text : {}
		};
		$scope.taskId = values.taskId;
		$scope.noteWrapper.note.Installation_Task__c = values.taskId;
	});

	$scope.$on('contactSelected-emit', function(event, values) {
		$scope.displayContactValue = false;
		$scope.displayContactLabel = true;
		$scope.contactName = values.item.label;
		$scope.noteWrapper.note.Company__c = values.item.accountId;
		$scope.noteWrapper.note.Contact__c = values.item.valueId;
		$scope.contactSearch = '';
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();

		$scope.formValidator.Subject__c.error = _.isEmpty($scope.noteWrapper.note.Subject__c);
		$scope.formValidator.Reason__c.error = _.isEmpty($scope.noteWrapper.note.Reason__c);
		if ($scope.noteWrapper.note.Expire_on__c) {
			var d_today = new Date();
			var dateString = (d_today.getUTCMonth() + 1) + '/' + d_today.getUTCDate() + '/' + d_today.getUTCFullYear();
			if (!$scope.noteWrapper.note.Expire_on__c.match(/^((1[0-2])|(0[1-9])|([1-9]))\/((3[0-1])|([1-2][0-9])|(0[1-9])|([1-9]))\/(\d{4})$/g)) {
				$scope.formValidator.Expire_on__c.error = true;
				$scope.formValidator.Expire_on__c.message = 'Invalid MM/DD/YYYY date';
			} else {
				var expireOn = new Date($scope.noteWrapper.note.Expire_on__c + ' 00:00:00 GMT');
				if (_.isDate(expireOn)) {
					$scope.formValidator.Expire_on__c.error = (new Date(dateString + ' 00:00:00 GMT')) > expireOn;
					$scope.formValidator.Expire_on__c.message = 'Date must be in the future'
				} else {
					$scope.formValidator.Expire_on__c.error = true;
					$scope.formValidator.Expire_on__c.message = 'Invalid MM/DD/YYYY date';
				}
			}
		}
		$scope.formValidator.Contact__c.error = !_.isEmpty($scope.contactSearch) && _.isEmpty($scope.noteWrapper.note.Contact__c);
		$scope.formValidator.Type__c.error = _.isEmpty($scope.textWrapper.text.Type__c);
		$scope.formValidator.Notes_Text_Score__c.error = _.isEmpty($scope.textWrapper.text.Notes_Text_Score__c);
		$scope.formValidator.Notes__c.error = _.isEmpty($scope.textWrapper.text.Notes__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length == 0;
	};

	$scope.saveNote = function() {
		if ($scope.validateForm()) {
			if (!$scope.noteWrapper.note.Expire_on__c) {
				delete $scope.noteWrapper.note.Expire_on__c;
			}
			$scope.$emit('createNoteAndText-emit', {
				taskId : $scope.taskId,
				noteWrapper : $scope.noteWrapper,
				textWrapper : $scope.textWrapper
			});
		}
	};

	$scope.cancel = function() {
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.clearContact = function() {
		$scope.displayContactValue = true;
		$scope.displayContactLabel = false;
		$scope.contactName = '';
		$scope.contactSearch = '';
		$scope.noteWrapper.note.Contact__c = '';
		$scope.noteWrapper.note.Company__c = '';
	};

	$scope.$watch('noteWrapper.note.Use_Warning__c', function(newValue, oldValue) {
		if (!newValue) {
			delete $scope.noteWrapper.note.Expire_on__c;
		}
	});

	$scope.$watch('contactSearch', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});

	$scope.$watchCollection('noteWrapper.note', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});

	$scope.$watchCollection('textWrapper.text', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});
}]);
var app = angular.module("itlApp");

app.controller("homeController", ["$scope", function($scope) {
	
}]);
var app = angular.module('itlApp');

app.controller('noteModalController', ['$scope', function($scope) {
	$scope.displayCreateNoteModal = false;
	$scope.displayViewNoteModal = false;
	$scope.displayAppendNoteModal = false;
	$scope.displayCreateIssueModal = false;
	$scope.canCreateNotes = false;
	$scope.createNoteModalTemplate = resourceUrl + '/partials/createNoteModal.html';
	$scope.appendNoteModalTemplate = resourceUrl + '/partials/appendNoteModal.html';
	$scope.createIssueModalTemplate = resourceUrl + '/partials/createIssueModal.html';
	$scope.xlinkHelper = {
		close : resourceUrl + "/icons/action-sprite/svg/symbols.svg#close"
	};
	$scope.noteWrapper = {};

	$scope.switchTab = function(tabName) {
		$(".slds-tabs__item").removeClass("slds-active");
		$(".slds-tabs__content").removeClass("slds-show");
		$(".slds-tabs__content").addClass("slds-hide");
		$("#" + tabName + "--tab").addClass("slds-active");
		$("#" + tabName + "--panel").removeClass("slds-hide");
		$("#" + tabName + "--panel").addClass("slds-show");
	};

	$scope.hideAllModals = function() {
		$scope.displayCreateNoteModal = false;
		$scope.displayViewNoteModal = false;
		$scope.displayAppendNoteModal = false;
		$scope.displayCreateIssueModal = false;
	};

	$scope.$on('createNoteModal-broadcast', function(event, values) {
		$scope.hideAllModals();
		$scope.displayCreateNoteModal = true;
	});

	$scope.$on('viewNoteModal-broadcast', function(event, values) {
		$scope.hideAllModals();
		$scope.noteWrapper = values.noteWrapper;
		$scope.canCreateNotes = values.canCreateNotes;
		$scope.displayViewNoteModal = true;
		$scope.switchTab('note-text');
	});

	$scope.$on('cancelNoteModal-emit', function(event, values) {
		$scope.hideAllModals();
		$scope.displayViewNoteModal = true;
	});

	$scope.closeModal = function() {
		$scope.hideAllModals();
		$scope.noteWrapper = {};
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.appendNoteModal = function() {
		$scope.hideAllModals();
		$scope.displayAppendNoteModal = true;
		$scope.$broadcast('appendNoteModal-broadcast', {
			noteWrapper : $scope.noteWrapper
		});
	};

	$scope.createIssueModal = function() {
		$scope.hideAllModals();
		$scope.displayCreateIssueModal = true;
		$scope.$broadcast('createIssueModal-broadcast', {
			noteWrapper : $scope.noteWrapper
		});
	};

}]);
var app = angular.module("itlApp");

app.controller("phaseModalController", ["$scope", "componentService", function($scope, componentService) {
	$scope.modalPhase = {};
	$scope.formValidator = {
		form: {
			message: 'An error occurred. Please try again.'
		},
		Phase_Name__c: {
			message: 'Name is required'
		}
	};

	$scope.$on("phaseCreate-broadcast", function() {
		$scope.modalPhase = {};
		$scope.clearValidation();
	});

	$scope.$on("phaseEdited-broadcast", function(event, values) {
		$scope.modalPhase = values.phase;
		$scope.modalPhase.Phase_Name__c = componentService.removeEscapedCharacters($scope.modalPhase.Phase_Name__c);
		$scope.clearValidation();
	});

	$scope.$on("phaseModal-displayError", function(event, values) {
		$scope.displayRemoteError(values.message);
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();
		$scope.formValidator.Phase_Name__c.error = _.isEmpty($scope.modalPhase.Phase_Name__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length > 0;
	};

	$scope.handleSaveModalPhase = function() {
		if (!$scope.validateForm()) {
			$scope.saveModalPhase();
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

	$scope.saveModalPhase = function() {
		if ($scope.modalPhase.Id) {
			$scope.$emit("saveModalPhase", {
				phase: $scope.modalPhase
			});
		} else {
			$scope.$emit("createModalPhase", {
				phase: $scope.modalPhase
			});
		}
	};

	$scope.cancelModalPhase = function() {
		$scope.modalPhase = {};
		$scope.$emit("cancelModalPhase");
	};

}]);
var app = angular.module('itlApp');

app.controller('taskListController', ['$scope', '$window', 'dateService', 'componentService', function($scope, $window, dateService, componentService) {
	$scope.spinner = {
		display : true,
		jobCount : 0
	};
	$scope.vars = {
		taskListId : taskListId,
		taskId : window.taskId
	};
	$scope.planId = planId;
	$scope.taskListTemplate = resourceUrl + '/partials/taskList.html';
	$scope.noteModalTemplate = resourceUrl + '/partials/noteModal.html';
	$scope.resourceUrl = resourceUrl;
	$scope.listWrapper = {};
	$scope.allTaskLists = [];
	$scope.taskWrapperDetail = {};
	$scope.taskWrapperDetailHelper = {};
	$scope.xlinkHelper = {
		add : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#add",
		edit : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#edit",
		check : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#check",
		delete : resourceUrl + "/icons/action-sprite/svg/symbols.svg#delete",
		edit2 : resourceUrl + "/icons/action-sprite/svg/symbols.svg#edit",
		approval : resourceUrl + "/icons/action-sprite/svg/symbols.svg#approval",
		retweet : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#retweet",
		help : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#help",
		left_align_text : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#left_align_text",
		news : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#news",
		image : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#image",
		environment_hub : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#environment_hub",
		task : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#task",
		record : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#record",
		note : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#note"
	};
	$scope.taskDetailMessage = '';
	$scope.listMessage = '';
	$scope.displayListCompletionWarning = false;
	$scope.displayNoteModal = false;
	$scope.contactOptions = [];
	$scope.formValidator = {
		Target_Date__c : {
			message : 'Invalid MM/DD/YYYY date'
		}
	};

	$scope.addSpinningJob = function() {
		$scope.spinner.display = true;
		$scope.spinner.jobCount++;
	};

	$scope.removeSpinningJob = function() {
		$scope.spinner.jobCount--;
		$scope.spinner.display = $scope.spinner.jobCount > 0;
	};

	$scope.validateListCompletion = function() {
		var isValid = true;
		$scope.listMessage = '';
		_.each($scope.listWrapper.phaseWrappers, function(phaseWrapper) {
			_.each(phaseWrapper.taskWrappers, function(taskWrapper) {
				if (taskWrapper.task.Status__c == 'Not Completed' || taskWrapper.task.Status__c == 'Not Reviewed') {
					isValid = false;
					$scope.listMessage = 'All tasks must be completed before completing the list';
				}
			});
		});
		return isValid;
	};

	$scope.saveListCompletion = function() {
		$scope.displayListCompletionWarning = false;
		$scope.addSpinningJob();
		InstallationTaskListController.completeTaskList($scope.listWrapper.taskList,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.init();
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.cancelListCompletion = function() {
		$scope.displayListCompletionWarning = false;
	};

	$scope.warnListCompletion = function() {
		if ($scope.validateListCompletion()) {
			$scope.displayListCompletionWarning = true;
		}
	};

	$scope.validatePrereqCompletion = function() {
		var isValid = true;
		$scope.taskDetailMessage = '';
		if (($scope.taskWrapperDetail.task.Status__c == 'Completed' || $scope.taskWrapperDetail.task.Status__c == 'Reviewed') 
			&& $scope.taskWrapperDetail.prereqTaskName && !$scope.taskWrapperDetail.prereqTaskCompleted) {
			isValid = false;
			$scope.taskDetailMessage = "ERROR: The <i>" + $scope.taskWrapperDetail.prereqTaskName + "</i> task must be completed prior to completing this task";
			switch ($scope.taskWrapperDetail.task.Status__c) {
				case 'Completed':
					$scope.taskWrapperDetail.task.Status__c = 'Not Completed';
					break;
				case 'Reviewed':
					$scope.taskWrapperDetail.task.Status__c = 'Not Reviewed';
					break;
			}
		}
		return isValid;
	};

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.updateTaskStatus = function() {
		if ($scope.validatePrereqCompletion()) {
			$scope.saveTask();
		}
	};

	$scope.updateTaskTargetDate = function() {
		$scope.clearValidation();
		if ($scope.taskWrapperDetailHelper.Target_Date__c) {
			if (!$scope.taskWrapperDetailHelper.Target_Date__c.match(/^((1[0-2])|(0[1-9])|([1-9]))\/((3[0-1])|([1-2][0-9])|(0[1-9])|([1-9]))\/(\d{4})$/g)) {
				$scope.formValidator.Target_Date__c.error = true;
				$scope.formValidator.Target_Date__c.message = 'Invalid MM/DD/YYYY date';
			} else {
				var targetDate = new Date($scope.taskWrapperDetailHelper.Target_Date__c);
				if (!_.isDate(targetDate)) {
					$scope.formValidator.Target_Date__c.error = true;
					$scope.formValidator.Target_Date__c.message = 'Invalid MM/DD/YYYY date';
				} else {
					$scope.taskWrapperDetail.task.Target_Date__c = dateService.convertToSFDCSafeString($scope.taskWrapperDetailHelper.Target_Date__c);
					$scope.saveTask();
				}
			}
		}
	};

	$scope.saveTask = function() {
		$scope.addSpinningJob();
		$scope.taskWrapperDetail.task.Task_Name__c = componentService.removeEscapedCharacters($scope.taskWrapperDetail.task.Task_Name__c);
		$scope.taskWrapperDetail.task.Editing_Roles__c = componentService.removeEscapedCharacters($scope.taskWrapperDetail.task.Editing_Roles__c);
		$scope.taskWrapperDetail.task.Description__c = componentService.removeEscapedCharacters($scope.taskWrapperDetail.task.Description__c);
		$scope.taskWrapperDetail.task.Group_Responsible__c = componentService.removeEscapedCharacters($scope.taskWrapperDetail.task.Group_Responsible__c);
		InstallationTaskListController.saveTask($scope.taskWrapperDetail.task,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.getTaskList();
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.displayTaskDetails = function(taskWrapper) {
		$scope.taskWrapperDetail = taskWrapper;
		$scope.taskWrapperDetailHelper = {};
		if ($scope.taskWrapperDetail.task.Target_Date__c) {
			$scope.taskWrapperDetailHelper.Target_Date__c = dateService.convertToDateString($scope.taskWrapperDetail.task.Target_Date__c);
		}
		$scope.taskDetailMessage = '';
	};

	$scope.viewNote = function(noteWrapper, canCreateNotes) {
		$scope.displayNoteModal = true;
		$scope.$broadcast('viewNoteModal-broadcast', {
			noteWrapper : noteWrapper,
			canCreateNotes : canCreateNotes
		});
	};

	$scope.switchLists = function() {
		$scope.taskWrapperDetail = {};
		$scope.getTaskList();
	};

	$scope.getTaskList = function() {
		$scope.listMessage = '';
		$scope.taskDetailMessage = '';
		$scope.addSpinningJob();
		InstallationTaskListController.getTaskList($scope.vars.taskListId,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.listWrapper = result;
						_.each($scope.listWrapper.phaseWrappers, function(phaseWrapper) {
							_.each(phaseWrapper.taskWrappers, function(taskWrapper) {
								taskWrapper.task.Available_Statuses__c = componentService.fixStatuses(taskWrapper.task.Available_Statuses__c);
							});
						});
						if ($scope.taskWrapperDetail.task) {
							$scope.vars.taskId = $scope.taskWrapperDetail.task.Id;	
						}
						if ($scope.vars.taskId) {
							var taskWrapper;
							_.filter($scope.listWrapper.phaseWrappers, function(phaseWrapper) {
								var result = _.filter(phaseWrapper.taskWrappers, function(taskWrapper) {
									return taskWrapper.task.Id == $scope.vars.taskId;
								});
								if (result.length > 0) {
									taskWrapper = result[0];
								}
								return result.length > 0;
							});
							$scope.displayTaskDetails(taskWrapper);
							delete $scope.vars.taskId;
						}
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.getAllTaskLists = function() {
		$scope.addSpinningJob();
		InstallationTaskListController.getAllTaskLists($scope.planId,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.allTaskLists = result;
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.getContactOptions = function() {
		$scope.addSpinningJob();
		InstallationTaskListController.getContactOptions($scope.planId,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.contactOptions = result;
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.newNote = function(taskId) {
		$scope.displayNoteModal = true;
		$scope.$broadcast('createNoteModal-broadcast', {
			taskId : taskId
		});
	};

	$scope.$on('closeNoteModal-emit', function(event, values) {
		$scope.displayNoteModal = false;
	});

	$scope.$on('createNoteAndText-emit', function(event, values) {
		$scope.addSpinningJob();
		var noteWrapperJSON = angular.toJson(values.noteWrapper);
		var noteWrapper = $.parseJSON(noteWrapperJSON);
		noteWrapper.note.Plan__c = $scope.planId;
		if (noteWrapper.note.Use_Warning__c && noteWrapper.note.Expire_on__c) {
			noteWrapper.note.Expire_on__c = dateService.convertToSFDCSafeString(noteWrapper.note.Expire_on__c);
		} else {
			delete noteWrapper.note.Expire_on__c;
		}
		InstallationTaskListController.saveNote(noteWrapper,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						if (result.success) {
							values.textWrapper.text.Plan_Notes__c = result.id;
							$scope.saveNoteText(values.textWrapper, values.taskId);
						}
						$scope.removeSpinningJob();
					}
				});
			}
		);
	});

	$scope.$on('createText-emit', function(event, values) {
		$scope.saveNoteText(values.textWrapper, values.taskId);
	});

	$scope.$on('createIssue-emit', function(event, values) {
		$scope.addSpinningJob();
		var issueWrapperJSON = angular.toJson(values.issueWrapper);
  		var issueWrapper = $.parseJSON(issueWrapperJSON);
  		issueWrapper.issue.Discovered__c = dateService.convertToSFDCSafeString(issueWrapper.issue.Discovered__c);
  		issueWrapper.issue.Resolved__c = dateService.convertToSFDCSafeString(issueWrapper.issue.Resolved__c);
		InstallationTaskListController.saveNoteIssue(issueWrapper,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.getTask(values.taskId);
						$scope.displayNoteModal = false;
					}
					$scope.removeSpinningJob();
				});
			}
		);
	});

	$scope.saveNoteText = function(textWrapper, taskId) {
		$scope.addSpinningJob();
		InstallationTaskListController.saveNoteText(textWrapper,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.getTask(taskId);
						$scope.displayNoteModal = false;
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.getTask = function(taskId) {
		$scope.addSpinningJob();
		InstallationTaskListController.getTask(taskId,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.taskWrapperDetail = result;
						$scope.taskWrapperDetail.task.Available_Statuses__c = componentService.fixStatuses($scope.taskWrapperDetail.task.Available_Statuses__c);
						var taskWrapper;
						_.each($scope.listWrapper.phaseWrappers, function(phaseWrapper, phaseIndex) {
							_.each(phaseWrapper.taskWrappers, function(taskWrapper, taskIndex) {
								if (taskWrapper.task.Id == $scope.taskWrapperDetail.task.Id) {
									$scope.listWrapper.phaseWrappers[phaseIndex].taskWrappers[taskIndex] = $scope.taskWrapperDetail;
								}
							});
						});
					}
					$scope.removeSpinningJob();
				});
			}
		);
	};

	$scope.goToPlan = function() {
		$window.location.href = '/' + $scope.planId;
	};

	$scope.init = function() {
		$scope.taskWrapperDetail = {};
		$scope.getTaskList();
		$scope.getAllTaskLists();
		$scope.getContactOptions();
	};
	$scope.init();
}]);
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
var app = angular.module("itlApp");

app.controller('templateController', ['$scope', '$routeParams', '$window', 'componentService', function($scope, $routeParams, $window, componentService) {
	$scope.helper = {
		formReady : false,
		showPhaseEditModal: false,
		showTaskEditModal: false
	};
	$scope.resourceUrl = resourceUrl;
	$scope.templateId = templateId;
	$scope.template = {};
	$scope.xlinkHelper = {
		add : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#add",
		edit : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#edit",
		check : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#check",
		delete : resourceUrl + "/icons/action-sprite/svg/symbols.svg#delete",
		edit2 : resourceUrl + "/icons/action-sprite/svg/symbols.svg#edit",
		retweet : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#retweet",
		help : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#help",
		left_align_text : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#left_align_text",
		news : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#news",
		image : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#image",
		environment_hub : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#environment_hub",
		task : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#task"
	};
	$scope.availableTasks = [];
	$scope.availablePhases = [];
	$scope.taskModalTemplate = resourceUrl + '/partials/taskModal.html';
	$scope.phaseModalTemplate = resourceUrl + '/partials/phaseModal.html';
	$scope.templateTemplate = resourceUrl + '/partials/template.html';
	$scope.templateEditMode = false;
	$scope.taskList = [];
	$scope.errorMessage = '';
	$scope.addPhaseModal = {};
	$scope.addTaskModal = {};

	$scope.init = function() {
		$scope.getTemplate();
		$scope.getLibrary();
	};

	$scope.switchTab = function(tabName) {
		$(".slds-tabs__item").removeClass("slds-active");
		$(".slds-tabs__content").removeClass("slds-show");
		$(".slds-tabs__content").addClass("slds-hide");
		$("." + tabName + "--tab").addClass("slds-active");
		$("." + tabName + "--panel").removeClass("slds-hide");
		$("." + tabName + "--panel").addClass("slds-show");
	};

	$scope.toggleTemplateEdit = function() {
		$scope.templateEditMode = !$scope.templateEditMode;
		if ($scope.templateEditMode) {
			$("#template-panel").animate({
				marginLeft: 460
			});
			$("#component-list-panel").animate({
				left: 10
			});
			$scope.$broadcast("templateEditModeOn");
		} else {
			$("#template-panel").animate({
				marginLeft: 0
			});
			$("#component-list-panel").animate({
				left: -450
			});
			$scope.$broadcast("templateEditModeOff");
			$scope.destroyDragAndSort();
		}
	};

	$scope.updateTaskList = function() {
		$scope.taskList = [];
		if ($scope.template.phaseWrappers) {
			_.each($scope.template.phaseWrappers, function(phaseWrapper) {
				if (phaseWrapper.taskWrappers) {
					_.each(phaseWrapper.taskWrappers, function(taskWrapper) {
						$scope.taskList.push(taskWrapper);
					});
				}
			});
		}
		if ($scope.taskList.length > 0) {
			var prereqMap = {};
			var targetMap = {};
			var existingIndexes = [];
			_.each($scope.taskList, function(taskWrapper) {
				if (taskWrapper.templateOrderIndex) {
					existingIndexes.push("" + taskWrapper.templateOrderIndex);
				}
				if (taskWrapper.prereqTaskIndex) {
					var indexString = "" + taskWrapper.prereqTaskIndex;
					if (_.isUndefined(prereqMap[indexString])) {
						prereqMap[indexString] = [];
					}
					prereqMap[indexString].push(taskWrapper);
				}
				if (taskWrapper.targetDateTaskIndex) {
					var indexString = "" + taskWrapper.targetDateTaskIndex;
					if (_.isUndefined(targetMap[indexString])) {
						targetMap[indexString] = [];
					}
					targetMap[indexString].push(taskWrapper);
				}
			});
			var prereqKeys = _.keys(prereqMap);
			var deletedPrereqKeys = _.difference(prereqKeys, existingIndexes);
			_.each(deletedPrereqKeys, function(deletedKey) {
				_.each(prereqMap[deletedKey], function(taskWrapper) {
					delete taskWrapper.prereqTaskIndex;
				});
				delete prereqMap[deletedKey];
			});

			var targetKeys = _.keys(targetMap);
			var deletedTargetKeys = _.difference(targetKeys, existingIndexes);
			_.each(deletedTargetKeys, function(deletedKey) {
				_.each(targetMap[deletedKey], function(taskWrapper) {
					delete taskWrapper.targetDateTaskIndex;
					if (taskWrapper.association.Target_Date_Based_On__c == 'Task Completion Date') {
						taskWrapper.association.Target_Date_Based_On__c = 'List Creation Date';
					}
				});
				delete targetMap[deletedKey];
			});

			_.each($scope.taskList, function(taskWrapper, index) {
				if (prereqMap[taskWrapper.templateOrderIndex]) {
					_.each(prereqMap[taskWrapper.templateOrderIndex], function(otherTaskWrapper) {
						otherTaskWrapper.prereqTaskIndex = index;
					});
				}
				if (targetMap[taskWrapper.templateOrderIndex]) {
					_.each(targetMap[taskWrapper.templateOrderIndex], function(otherTaskWrapper) {
						otherTaskWrapper.targetDateTaskIndex = index;
					});
				}
				taskWrapper.templateOrderIndex = index;
			});
		}
	};

	$scope.formatTemplate = function() {
		$scope.template.iList.ITL_Name__c = componentService.removeEscapedCharacters($scope.template.iList.ITL_Name__c);
		_.each($scope.template.phaseWrappers, function(phaseWrapper) {
			phaseWrapper.association.Phase_Template__r.Phase_Name__c = componentService.removeEscapedCharacters(phaseWrapper.association.Phase_Template__r.Phase_Name__c);
			_.each(phaseWrapper.taskWrappers, function(taskWrapper) {
				taskWrapper.association.Task_Template__r.Editing_Roles__c = componentService.removeEscapedCharacters(taskWrapper.association.Task_Template__r.Editing_Roles__c);
				taskWrapper.association.Task_Template__r.Description__c = componentService.removeEscapedCharacters(taskWrapper.association.Task_Template__r.Description__c);
				taskWrapper.association.Task_Template__r.Task_Name__c = componentService.removeEscapedCharacters(taskWrapper.association.Task_Template__r.Task_Name__c);
				taskWrapper.association.Task_Template__r.Group_Responsible__c = componentService.removeEscapedCharacters(taskWrapper.association.Task_Template__r.Group_Responsible__c);
				taskWrapper.association.Task_Template__r.Statuses__c = componentService.fixStatuses(taskWrapper.association.Task_Template__r.Statuses__c);
			});
		});
	};

	$scope.getTemplate = function() {
		$scope.helper.formReady = false;
		ITLTemplateManager.getTemplate($scope.templateId,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						$scope.template = result;
						$scope.formatTemplate();
						$scope.updateTaskList();
						$scope.helper.formReady = true;
					}
				});
			}
		);
	};

	$scope.formatLibrary = function() {
		_.each($scope.availableTasks, function(availableTask) {
			availableTask.Description__c = componentService.removeEscapedCharacters(availableTask.Description__c);
			availableTask.Task_Name__c = componentService.removeEscapedCharacters(availableTask.Task_Name__c);
			availableTask.Editing_Roles__c = componentService.removeEscapedCharacters(availableTask.Editing_Roles__c);
			availableTask.Group_Responsible__c = componentService.removeEscapedCharacters(availableTask.Group_Responsible__c);
			availableTask.Statuses__c = componentService.fixStatuses(availableTask.Statuses__c);
		});
		_.each($scope.availablePhases, function(availablePhase) {
			availablePhase.Phase_Name__c = componentService.removeEscapedCharacters(availablePhase.Phase_Name__c);
		});
	};

	$scope.getLibrary = function() {
		$scope.helper.formReady = false;
		ITLTemplateManager.getLibrary(
			function(result, event) {
				$scope.$apply(function() {
					$scope.availableTasks = result.tasks;
					$scope.availablePhases = result.phases;
					$scope.formatLibrary();
					$scope.helper.formReady = true;
				});
			}
		);
	};

	$scope.$on("phaseDeleted", function(event, values) {
		$scope.template.phaseWrappers.splice(values.index, 1);
		$scope.updateTaskList();
	});

	$scope.$on("taskDeleted", function(event, values) {
		var phaseWrapper = $scope.template.phaseWrappers[values.parentIndex];
		phaseWrapper.taskWrappers.splice(values.index, 1);
		$scope.updateTaskList();
	});

	$scope.formatForSave = function(template) {
		if (template.phaseWrappers) {
			_.each(template.phaseWrappers, function(phaseWrapper, phaseIndex) {
				delete phaseWrapper.association.Phase_Template__r;
				phaseWrapper.association.Order__c = phaseIndex;
				if (phaseWrapper.taskWrappers) {
					_.each(phaseWrapper.taskWrappers, function(taskWrapper, taskIndex) {
						delete taskWrapper.association.Task_Template__r;
						taskWrapper.association.Order__c = taskIndex;
					});
				}
			});
		}
		return template;
	};

	$scope.saveTemplate = function() {
		$scope.helper.formReady = false;
		var templateJSON = angular.toJson($scope.template);
  		var template = $.parseJSON(templateJSON);
  		template = $scope.formatForSave(template);
		ITLTemplateManager.saveTemplate(template,
			function(result, event) {
				if (event.status) {
					$scope.toggleTemplateEdit();
					$scope.getTemplate();
				}
				$scope.helper.formReady = true;
			}
		);
	};

	$scope.showAddPhaseModal = function(index) {
		$scope.addPhaseModal = {
			index : index
		};
		$scope.showPhaseEditModal();
		$scope.$broadcast("phaseCreate-broadcast");
	};

	$scope.showAddTaskModal = function(index, subIndex) {
		var association = $scope.template.phaseWrappers[index].association;
		var phase = {
			Id: association.Phase_Template__c,
			Phase_Name__c: association.Phase_Template__r.Phase_Name__c
		};
		$scope.addTaskModal = {
			index : index,
			subIndex : subIndex
		};
		$scope.showTaskEditModal();
		$scope.$broadcast("taskCreate-broadcast", {
			taskList: $scope.taskList,
			phase: phase
		});
	};

	$scope.$on("phaseEdited", function(event, values) {
		$scope.showPhaseEditModal();
		var association = $scope.template.phaseWrappers[values.index].association;
		var phase = {
			Id: association.Phase_Template__c,
			Phase_Name__c: association.Phase_Template__r.Phase_Name__c
		};
		$scope.$broadcast("phaseEdited-broadcast", {
			phase: phase
		});
	});

	$scope.$on("taskEdited", function(event, values) {
		$scope.taskEditedEventHandler(values);
	});

	$scope.taskEditedEventHandler = function(values) {
		var association = $scope.template.phaseWrappers[values.parentIndex].association;
		var phase = {
			Id: association.Phase_Template__c,
			Phase_Name__c: association.Phase_Template__r.Phase_Name__c
		};
		$scope.showTaskEditModal();
		var phaseWrapper = $scope.template.phaseWrappers[values.parentIndex];
		var taskWrapper = phaseWrapper.taskWrappers[values.index];
		var task = _.clone(taskWrapper.association.Task_Template__r);
		task.Id = taskWrapper.association.Task_Template__c;
		var v_taskWrapper = _.clone(taskWrapper);
		v_taskWrapper.association = _.clone(taskWrapper.association);
		delete v_taskWrapper.association.Task_Template__r;
		$scope.addTaskModal = {
			index : values.parentIndex,
			subIndex : values.index
		};
		$scope.$broadcast("taskEdited-broadcast", {
			task: task,
			phase: phase,
			taskWrapper: v_taskWrapper,
			taskList: $scope.taskList,
			skipToSpecificAttributes: values.skipToSpecificAttributes
		});
	};

	$scope.showPhaseEditModal = function() {
		$scope.helper.showPhaseEditModal = true;
	};

	$scope.closePhaseEditModal = function() {
		$scope.helper.showPhaseEditModal = false;
	};

	$scope.showTaskEditModal = function() {
		$scope.helper.showTaskEditModal = true;
	};

	$scope.closeTaskEditModal = function() {
		$scope.helper.showTaskEditModal = false;
	};

	$scope.$on("createModalPhase", function(event, values) {
		$scope.helper.formReady = false;
		ITLTemplateManager.savePhase(values.phase,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						if (result.success) {
							var association = {
								Order__c : $scope.addPhaseModal.index,
								Phase_Template__c : result.id,
								List_Template__c : $scope.templateId,
								Phase_Template__r : {}
							};
							_.extend(association.Phase_Template__r, values.phase);
							var phaseWrapper = {
								association : association,
								taskWrappers : []
							};
							$scope.template.phaseWrappers.splice(phaseWrapper.association.Order__c, 0, phaseWrapper);
							$scope.updateTaskList();
							$scope.$broadcast('phaseAddedToTemplate', {
								phaseId : phaseWrapper.association.Phase_Template__c
							});
							$scope.closePhaseEditModal();
						} else {
							$scope.$broadcast('phaseModal-displayError');
							$scope.helper.formReady = true;
						}
					}
				});
				$scope.getLibrary();
			}
		);
	});

	$scope.$on("saveModalPhase", function(event, values) {
		$scope.helper.formReady = false;
		ITLTemplateManager.savePhase(values.phase,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						if (result.success) {
							var phase = _.clone(values.phase);
							var phaseId = phase.Id;
							delete phase.Id;
							delete phase.$$hashKey;
							var associations = _.filter($scope.template.phaseWrappers, function(phaseWrapper) {
								return phaseWrapper.association.Phase_Template__c == phaseId;
							});
							_.each(associations, function(association, index) {
								_.extend(association.Phase_Template__r, phase);
							});
							$scope.closePhaseEditModal();
						}
					} else {
						$scope.$broadcast('phaseModal-displayError');
						$scope.helper.formReady = true;
					}
				});
				$scope.getLibrary();
			}
		);
	});

	$scope.$on("cancelModalPhase", function() {
		$scope.closePhaseEditModal();
	});

	$scope.$on("createModalTask", function(event, values) {
		$scope.helper.formReady = false;
		delete values.task.Phase_Template__r;
		ITLTemplateManager.saveTask(values.task,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						if (result.success) {

							var phaseWrapper = $scope.template.phaseWrappers[$scope.addTaskModal.index];
							var taskWrapper = _.clone(values.taskWrapper);
							taskWrapper.association = {};
							_.extend(taskWrapper.association, values.taskWrapper.association);
							taskWrapper.association.List_Template__c = $scope.templateId;
							taskWrapper.association.Task_Template__c = result.id;
							taskWrapper.association.Order__c = $scope.addTaskModal.subIndex;
							taskWrapper.association.Task_Template__r = {};
							_.extend(taskWrapper.association.Task_Template__r, values.task);

							if (!phaseWrapper.taskWrappers) {
								phaseWrapper.taskWrappers = [];
							}
							phaseWrapper.taskWrappers.splice(taskWrapper.association.Order__c, 0, taskWrapper);
							$scope.updateTaskList();
							$scope.closeTaskEditModal();
						} else {
							$scope.$broadcast('taskModal-displayError', {});
							$scope.helper.formReady = true;
						}
					} else {
						$scope.$broadcast('taskModal-displayError', {});
						$scope.helper.formReady = true;
					}
				});
				$scope.getLibrary();
			}
		);
	});

	$scope.$on("saveModalTask", function(event, values) {
		$scope.helper.formReady = false;
		ITLTemplateManager.saveTask(values.task,
			function(result, event) {
				$scope.$apply(function() {
					if (event.status) {
						if (result.success) {

							var v_taskWrapper = _.clone(values.taskWrapper);
							delete v_taskWrapper.$$hashKey;

							var taskAssociation = _.clone(values.taskWrapper.association);
							delete taskAssociation.$$hashKey;
							var phaseWrapper = $scope.template.phaseWrappers[$scope.addTaskModal.index];
							var taskWrapper = phaseWrapper.taskWrappers[$scope.addTaskModal.subIndex];
							_.extend(taskWrapper, v_taskWrapper);
							_.extend(taskWrapper.association, taskAssociation);

							var task = _.clone(values.task);
							var taskId = task.Id;
							delete task.Id;
							delete task.$$hashKey;
							_.each($scope.template.phaseWrappers, function(phaseWrapper) {
								_.each(phaseWrapper.taskWrappers, function(taskWrapper) {
									if (taskWrapper.association.Task_Template__c == taskId) {
										taskWrapper.association.Task_Template__r = {};
										_.extend(taskWrapper.association.Task_Template__r, task);
									}
								});
							});

							$scope.closeTaskEditModal();
						}
					} else {
						$scope.$broadcast('taskModal-displayError');
						$scope.helper.formReady = true;
					}
				});
				$scope.getLibrary();
			}
		);
	});

	$scope.$on("cancelModalTask", function() {
		$scope.closeTaskEditModal();
	});

	$scope.destroyDragAndSort = function() {
		if ($(".template-components").data('ui-sortable')) {
			$(".template-components").sortable("destroy");
		}
		if ($(".recurring-set-components").data('ui-sortable')) {
			$(".recurring-set-components").sortable("destroy");
		}
		if ($(".available-component").data('ui-draggable')) {
			$(".available-component").draggable("destroy");
		}
	};

	$scope.$on("phaseAndTaskAdded", function(event, values) {
		var phase = _.where($scope.availablePhases, {Id: values.phaseId});
		phase = _.clone(phase[0]);
		var association = {
			Phase_Template__c : phase.Id,
			Order__c : values.to,
			List_Template__c : $scope.templateId,
			Phase_Template__r : {}
		};
		delete phase.Id;
		delete phase.$$hashKey;
		_.extend(association.Phase_Template__r, phase);
		var phaseWrapper = {
			association : association,
			taskWrappers : []
		};
		$scope.template.phaseWrappers.splice(association.Order__c, 0, phaseWrapper);
		$scope.$broadcast('phaseAddedToTemplate', {
			phaseId : phaseWrapper.association.Phase_Template__c
		});

		var task = _.where($scope.availableTasks, {Id: values.taskId});
		task = _.clone(task[0]);
		var taskWrapper = {
			association : {
				Task_Template__c : task.Id,
				List_Template__c : $scope.templateId,
				Order__c : 0,
				Task_Template__r : {}
			}
		};
		delete task.Id;
		delete task.$$hashKey;
		_.extend(taskWrapper.association.Task_Template__r, task);
		phaseWrapper.taskWrappers.splice(taskWrapper.association.Order__c, 0, taskWrapper);
		$scope.updateTaskList();

		var eventValues = {
			parentIndex : values.to,
			index : taskWrapper.association.Order__c,
			skipToSpecificAttributes : true
		};
		$scope.taskEditedEventHandler(eventValues);
	});

	$scope.$on("phaseSorted", function(event, values) {
		$scope.template.phaseWrappers.splice(values.to, 0, $scope.template.phaseWrappers.splice(values.from, 1)[0]);
		$scope.updateTaskList();
	});

	$scope.$on("phaseAdded", function(event, values) {
		var phase = _.where($scope.availablePhases, {Id: values.phaseId});
		phase = _.clone(phase[0]);
		var association = {
			Phase_Template__c : phase.Id,
			Order__c : values.to,
			List_Template__c : $scope.templateId,
			Phase_Template__r : {}
		};
		delete phase.Id;
		delete phase.$$hashKey;
		_.extend(association.Phase_Template__r, phase);
		var phaseWrapper = {
			association : association,
			taskWrappers : []
		};
		$scope.template.phaseWrappers.splice(association.Order__c, 0, phaseWrapper);
		$scope.updateTaskList();
		$scope.$broadcast('phaseAddedToTemplate', {
			phaseId : phaseWrapper.association.Phase_Template__c
		});
	});

	$scope.$on("taskSorted", function(event, values) {
		var phaseWrapper = $scope.template.phaseWrappers[values.phaseIndex];
		if (!phaseWrapper.taskWrappers) {
			phaseWrapper.taskWrappers = [];
		}
		phaseWrapper.taskWrappers.splice(values.to, 0, phaseWrapper.taskWrappers.splice(values.from, 1)[0]);
		$scope.updateTaskList();
	});

	$scope.$on("taskAdded", function(event, values) {
		var phaseWrapper = $scope.template.phaseWrappers[values.phaseIndex];
		if (_.isUndefined(phaseWrapper.taskWrappers)) {
			phaseWrapper.taskWrappers = [];
		}
		var task = _.where($scope.availableTasks, {Id: values.taskId});
		task = _.clone(task[0]);
		var taskWrapper = {
			association : {
				Task_Template__c : task.Id,
				List_Template__c : $scope.templateId,
				Order__c : values.to,
				Task_Template__r : {}
			}
		};
		delete task.Id;
		delete task.$$hashKey;
		_.extend(taskWrapper.association.Task_Template__r, task);
		if (!phaseWrapper.taskWrappers) {
			phaseWrapper.taskWrappers = [];
		}
		phaseWrapper.taskWrappers.splice(taskWrapper.association.Order__c, 0, taskWrapper);
		$scope.updateTaskList();

		var eventValues = {
			parentIndex : values.phaseIndex,
			index : taskWrapper.association.Order__c,
			skipToSpecificAttributes : true
		};
		$scope.addTaskModal.index = values.phaseIndex;
		$scope.addTaskModal.subIndex = taskWrapper.association.Order__c;
		$scope.taskEditedEventHandler(eventValues);
	});

	$scope.formatTemplateComponents = function(cmpArr) {
		var components = [];
		_.each(cmpArr, function(cmp) {
			var obj = _.omit(cmp, 'Component__r');
			if (cmp.Component__r) {
				delete cmp.Component__r.Id;
				_.extend(obj, cmp.Component__r);
				obj.Text__c = componentService.convertBackToHTML(obj.Text__c);
			}
			this.push(obj);
		}, components);
		cmpArr = components;
		return cmpArr;
	};

	$scope.goToTemplateDetails = function() {
		$window.location.href = '/' + $scope.templateId;
	};

	$scope.init();

}]);
var app = angular.module("itlApp");

app.directive("affixedComponentPanel", ["$window", function($window) {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(window).scroll(function() {
				if ($scope.templateEditMode) {
					if ($(window).scrollTop() >= $("#template-panel").offset().top) {
						$(element).css("position", "fixed");
						$(element).css("top", 0);
						$(element).css("left", 20);
					} else {
						$(element).css("position", "absolute");
						$(element).css("top", "");
						$(element).css("left", 10);
					}
				}
			});

		}
	}
}]);
var app = angular.module("itlApp");

app.directive("availableComponentsPanel", ["$window", function($window) {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(element).height($window.innerHeight - 230);
			$(window).resize(function() {
				$(element).height($window.innerHeight - 230);
			});

		}
	}
}]);
var app = angular.module("itlApp");

app.directive("availablePhaseDraggable", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).draggable({
					connectToSortable: ".template-components",
					helper: "clone",
					revert: "invalid"
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).draggable({
					connectToSortable: ".template-components",
					helper: "clone",
					revert: "invalid"
				});
			});

			$scope.$on("templateEditModeOff", function() {
				if ($(element).data('ui-draggable')) {
					$(element).draggable("destroy");
				}
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("availableTaskDraggable", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				var phaseId = angular.element(element).scope().task.Phase_Template__c;
				// var phaseId = $(element).data("phaseId");
				var connectToSortable;
				if ($(".tasks-phase-" + phaseId).length > 0) {
					connectToSortable = ".tasks-phase-" + phaseId;
				} else {
					connectToSortable = ".template-components";
				}
				$(element).draggable({
					connectToSortable: connectToSortable,
					helper: "clone",
					revert: "invalid"
				});
			}

			$scope.$on("templateEditModeOn", function() {
				var phaseId = angular.element(element).scope().task.Phase_Template__c;
				// var phaseId = $(element).data("phaseId");
				var connectToSortable;
				if ($(".tasks-phase-" + phaseId).length > 0) {
					connectToSortable = ".tasks-phase-" + phaseId;
				} else {
					connectToSortable = ".template-components";
				}
				$(element).draggable({
					connectToSortable: connectToSortable,
					helper: "clone",
					revert: "invalid"
				});
			});

			$scope.$on("phaseAddedToTemplate", function(event, values) {
				var phaseId = angular.element(element).scope().task.Phase_Template__c;
				// var phaseId = $(element).data("phaseId");
				if (phaseId == values.phaseId) {
					if ($(element).data('ui-draggable')) {
						$(element).draggable("destroy");
					}
					//var phaseId = $(element).data("phaseId");
					var connectToSortable;
					if ($(".tasks-phase-" + phaseId).length > 0) {
						connectToSortable = ".tasks-phase-" + phaseId;
					} else {
						connectToSortable = ".template-components";
					}
					$(element).draggable({
						connectToSortable: connectToSortable,
						helper: "clone",
						revert: "invalid"
					});
				}
			});

			$scope.$on("templateEditModeOff", function() {
				if ($(element).data('ui-draggable')) {
					$(element).draggable("destroy");
				}
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("componentSearch", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				$(".available-component").show();
				if (newValue) {
					$(".available-component").not(":containsi('" + newValue + "')").hide();
				}
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive('contactLookup', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            var renderItem = function(ul, item) {
                var liHTML = '<a id="' + item.valueId + '" role="option">'
                            + '<svg aria-hidden="true" class="slds-icon slds-icon-standard-account slds-icon--small ie-contact-icon">'
                            + '<use xlink:href="' + resourceUrl + '/icons/standard-sprite/svg/symbols.svg#contact"></use>'
                            + '</svg>' + item.label + '</a>';
                return $('<li>').addClass('slds-lookup__item').append(liHTML).appendTo(ul);
            };

            var renderMenu = function(ul, items) {
                $(ul).addClass('slds-lookup__list contact-lookup-menu');
                _.each(items, function(item) {
                    this._renderItemData(ul, item);
                }, this);
            };

        	$(element).autocomplete({
        		source: $scope.contactOptions,
        		select: function(event, ui) {
                    $scope.$apply(function() {
            			$scope.$emit('contactSelected-emit', {
            				item: ui.item
            			});
                    });
                    event.preventDefault();
        		},
                minLength: 0,
                appendTo: $(element).parent()
        	});

            $(element).autocomplete("instance")._renderItem = renderItem;
            $(element).autocomplete("instance")._renderMenu = renderMenu;

            $(element).prevAll('.slds-input__icon').click(function() {
                $(element).autocomplete( "search", "" );
            });

            //$(element).attr('autocomplete', 'on');
            
        }
    }
}]);
var app = angular.module("itlApp");

app.directive('datePicker', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            $(element).datepicker();

            if (attrs.mindate) {
            	$(element).datepicker("option", "minDate", attrs.mindate);
            }
        }
    }
}]);
var app = angular.module("itlApp");

app.directive("expandTableRow", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var details = $(this).find('.needs-expanding');
				details.toggleClass('slds-cell-wrap');
				details.toggleClass('formatted-text');
				details.toggleClass('slds-truncate');
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive('phaseCollapse', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            $(element).click(function() {
            	$(this).siblings('.slds-timeline').slideToggle();
            });
        }
    }
}]);
var app = angular.module("itlApp");

app.directive("phaseContainer", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).mouseover(function(event) {
					if (event.target === this) {
						$(this).find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").show();
						$(this).find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").show();
						$(this).find(".add-component-above-button").not(".task-components .add-component-above-button").show();
						$(this).find(".add-component-below-button").not(".task-components .add-component-below-button").show();
					}
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					$(this).find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).addClass("template-component-adder");
				$(element).off();
				$(element).mouseover(function(event) {
					if (event.target === this) {
						$(this).find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").show();
						$(this).find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").show();
						$(this).find(".add-component-above-button").not(".task-components .add-component-above-button").show();
						$(this).find(".add-component-below-button").not(".task-components .add-component-below-button").show();
					}
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					$(this).find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).off();
				$(element).removeClass("template-component-adder");
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("phaseDelete", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var phase = $(this).parents(".template-component");
				var index = angular.element(phase).scope().indexPhase;
				$scope.$apply(function() {
					$scope.$emit("phaseDeleted", {
						index: index
					});
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("phase", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).css("marginTop", 30).css("marginBottom", 30);
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).animate({
					marginTop: 30,
					marginBottom: 30
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).animate({
					marginTop: 0,
					marginBottom: 0
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("phaseEdit", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var phase = $(this).parents(".template-component");
				var index = angular.element(phase).scope().indexPhase;
				$scope.$apply(function() {
					$scope.$emit("phaseEdited", {
						index: index
					});
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("phaseSortable", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			var deactivate = function(event, ui) {
				if (ui.item.data("taskId")) {
					var taskId = ui.item.data("taskId");
					var phaseId = ui.item.data("phaseId");
					var to = element.children().index(ui.item);
					if (to >= 0) {
						$scope.$apply(function() {
							$scope.$emit("phaseAndTaskAdded", {
								taskId: taskId,
								phaseId: phaseId,
								to: to
							});
	          				ui.item.remove();
						});
					}
				} else {
					var phaseId = ui.item.data("phaseId");
					if ($(element).find('[data-phase-id="' + phaseId + '"]').length > 1) {
						ui.item.remove();
					} else {
						var from = -1;
						if (!_.isUndefined(angular.element(ui.item).scope().indexPhase)) {
							from = angular.element(ui.item).scope().indexPhase;
						}
		        		var to = element.children().index(ui.item);
		        		if (to >= 0) {
		          			$scope.$apply(function() {
		            			if (from >= 0) {
		              				$scope.$emit("phaseSorted", {from: from, to: to});
		            			} else {
		          					$scope.$emit("phaseAdded", {
										phaseId: phaseId,
										to: to
									});
		              				ui.item.remove();
		            			}
		          			});
		        		}
		        	}
	        	}
			};

			if ($scope.templateEditMode) {
				$(element).sortable({
					revert: true,
					tolerance: "pointer",
					placeholder: "ui-state-highlight",
					deactivate: deactivate
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).sortable({
					revert: true,
					tolerance: "pointer",
					placeholder: "ui-state-highlight",
					deactivate: deactivate
				});
			});

			$scope.$on("templateEditModeOff", function() {
				if ($(element).data('ui-sortable')) {
					$(element).sortable("destroy");
				}
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("taskContainer", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).mouseover(function() {
					$(this).find(".edit-component-corner-button").show();
					$(this).find(".delete-component-corner-button").show();
					$(this).find(".add-component-above-button").show();
					$(this).find(".add-component-below-button").show();
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").hide();
					$(this).find(".add-component-below-button").hide();
				}).mouseenter(function() {
					var parent = $(this).parents(".template-component-adder");
					parent.find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					parent.find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					parent.find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					parent.find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).addClass("task-component-adder");
				$(element).off();
				$(element).mouseover(function() {
					$(this).find(".edit-component-corner-button").show();
					$(this).find(".delete-component-corner-button").show();
					$(this).find(".add-component-above-button").show();
					$(this).find(".add-component-below-button").show();
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").hide();
					$(this).find(".add-component-below-button").hide();
				}).mouseenter(function() {
					var parent = $(this).parents(".template-component-adder");
					parent.find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					parent.find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					parent.find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					parent.find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).off();
				$(element).removeClass("task-component-adder");
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("taskDelete", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var cmp = $(this).parents(".task-component");
				var index = angular.element(cmp).scope().indexTask;
				var parentIndex = angular.element(cmp).scope().indexPhase;
				$scope.$apply(function() {
					$scope.$emit("taskDeleted", {
						index: index,
						parentIndex: parentIndex
					});
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("task", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).css("marginTop", 30).css("marginBottom", 30);
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).animate({
					marginTop: 30,
					marginBottom: 30
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).animate({
					marginTop: 0,
					marginBottom: 0
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("taskEdit", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var cmp = $(this).parents(".task-component");
				var index = angular.element(cmp).scope().indexTask;
				var parentIndex = angular.element(cmp).scope().indexPhase;
				$scope.$apply(function() {
					$scope.$emit("taskEdited", {
						index: index,
						parentIndex: parentIndex
					});
				});
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("taskScrollTop", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			$(element).click(function() {
				$(window).scrollTop(0);
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive("taskSortable", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			var deactivate = function(event, ui) {
				var phaseIndex = $(this).parents(".template-component").prevAll().length;
				var taskId = ui.item.data("taskId");
				var from = -1;
				if (!_.isUndefined(angular.element(ui.item).scope().indexTask)) {
					from = angular.element(ui.item).scope().indexTask;
				}
        		var to = element.children().index(ui.item);
        		if (to >= 0) {
          			$scope.$apply(function() {
            			if (from >= 0) {
              				$scope.$emit("taskSorted", {
								from: from,
								to: to,
								phaseIndex: phaseIndex
							});
            			} else {
          					$scope.$emit("taskAdded", {
								to: to,
								taskId: taskId,
								phaseIndex: phaseIndex
							});
              				ui.item.remove();
            			}
          			});
        		}
			};

			if ($scope.templateEditMode) {
				$(element).sortable({
					revert: true,
					tolerance: "pointer",
					placeholder: "ui-state-highlight",
					deactivate: deactivate
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).sortable({
					revert: true,
					tolerance: "pointer",
					placeholder: "ui-state-highlight",
					deactivate: deactivate
				});
			});

			$scope.$on("templateEditModeOff", function() {
				if ($(element).data('ui-sortable')) {
					$(element).sortable("destroy");
				}
			});

		}
	}
});
var app = angular.module("itlApp");

app.directive('windowHeight', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

        	var height = $window.innerHeight;
            $(element).css({
            	"maxHeight" : height,
            	"overflowY" : "auto"
            });
        }
    }
}]);
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
var app = angular.module('itlApp');

app.filter("changeTaskNumberToName", [function() {
	return function(input, taskList) {
		var inputNum = parseInt(input, 10);
		var tasks = _.where(taskList, {templateOrderIndex: inputNum});
		return tasks[0].association.Task_Template__r.Task_Name__c;
	};
}]);
var app = angular.module("itlApp");

app.service("componentService", [function() {
	this.convertBackToHTML = function(text) {
		var e = document.createElement('div');
	  	e.innerHTML = text;
	  	var ret = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	  	if (ret) {
	  		var e2 = document.createElement('div');
	  		$(e2).html(ret);
	  		$(e2).find("[style]").css("color", "");
	  		ret = $(e2).html();
	  	}
	  	return ret;
	};
	this.removeEscapedCharacters = function(text) {
		var e = document.createElement('div');
	  	e.innerHTML = text;
	  	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	};
	this.fixStatuses = function(statuses) {
		switch (statuses) {
			case 'Completed;Not Completed':
				statuses = 'Not Completed;Completed';
				break;
			case 'Not Applicable;Not Completed;Completed':
			case 'Not Applicable;Completed;Not Completed':
			case 'Not Completed;Completed;Not Applicable':
			case 'Completed;Not Completed;Not Applicable':
			case 'Completed;Not Applicable;Not Completed':
				statuses = 'Not Completed;Not Applicable;Completed';
				break;
			case 'Reviewed;Not Reviewed':
				statuses = 'Not Reviewed;Reviewed';
				break;
			case 'Reviewed;Not Applicable;Not Reviewed':
			case 'Not Applicable;Not Reviewed;Reviewed':
			case 'Not Applicable;Reviewed;Not Reviewed':
			case 'Not Reviewed;Reviewed;Not Applicable':
			case 'Reviewed;Not Reviewed;Not Applicable':
				statuses = 'Not Reviewed;Not Applicable;Reviewed';
				break;
		}
		return statuses;
	};
}]);
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

//# sourceMappingURL=app.js.map