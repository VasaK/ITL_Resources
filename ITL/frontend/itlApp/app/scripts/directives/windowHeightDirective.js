var app = angular.module("itlApp");

app.directive('windowHeight', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

        	var height = $window.innerHeight;
            $(element).css({
            	"maxHeight" : height,
            	"overflowY" : "auto"
            });
        }
    }
}]);