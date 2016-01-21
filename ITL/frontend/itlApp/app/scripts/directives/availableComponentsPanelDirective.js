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