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