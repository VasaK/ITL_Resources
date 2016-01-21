var app = angular.module("itlApp");

app.directive("taskScrollTop", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			$(element).click(function() {
				$(window).scrollTop(0);
			});

		}
	}
});