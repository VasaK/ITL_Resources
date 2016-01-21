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