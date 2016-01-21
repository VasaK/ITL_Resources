var app = angular.module("itlApp");

app.directive('datePicker', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            $(element).datepicker();

            if (attrs.mindate) {
            	$(element).datepicker("option", "minDate", attrs.mindate);
            }
        }
    }
}]);