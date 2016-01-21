var app = angular.module("itlApp");

app.directive("affixedComponentPanel", ["$window", function($window) {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {

			$(window).scroll(function() {
				if ($scope.templateEditMode) {
					if ($(window).scrollTop() >= $("#template-panel").offset().top) {
						$(element).css("position", "fixed");
						$(element).css("top", 0);
						$(element).css("left", 20);
					} else {
						$(element).css("position", "absolute");
						$(element).css("top", "");
						$(element).css("left", 10);
					}
				}
			});

		}
	}
}]);