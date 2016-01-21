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