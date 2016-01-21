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