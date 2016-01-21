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