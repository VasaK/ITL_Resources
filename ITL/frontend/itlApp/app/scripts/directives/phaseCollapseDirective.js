var app = angular.module("itlApp");

app.directive('phaseCollapse', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            $(element).click(function() {
            	$(this).siblings('.slds-timeline').slideToggle();
            });
        }
    }
}]);