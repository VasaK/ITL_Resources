var app = angular.module("itlApp");

app.directive("phase", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).css("marginTop", 30).css("marginBottom", 30);
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).animate({
					marginTop: 30,
					marginBottom: 30
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).animate({
					marginTop: 0,
					marginBottom: 0
				});
			});

		}
	}
});