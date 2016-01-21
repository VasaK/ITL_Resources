var app = angular.module("itlApp");

app.directive("expandTableRow", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			$(element).click(function() {
				var details = $(this).find('.needs-expanding');
				details.toggleClass('slds-cell-wrap');
				details.toggleClass('formatted-text');
				details.toggleClass('slds-truncate');
			});

		}
	}
});