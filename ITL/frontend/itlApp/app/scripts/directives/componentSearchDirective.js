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