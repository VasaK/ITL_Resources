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