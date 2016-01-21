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