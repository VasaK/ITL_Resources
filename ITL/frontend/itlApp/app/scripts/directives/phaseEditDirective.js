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