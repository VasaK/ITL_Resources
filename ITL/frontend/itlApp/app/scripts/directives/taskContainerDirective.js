var app = angular.module("itlApp");

app.directive("taskContainer", function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			if ($scope.templateEditMode) {
				$(element).mouseover(function() {
					$(this).find(".edit-component-corner-button").show();
					$(this).find(".delete-component-corner-button").show();
					$(this).find(".add-component-above-button").show();
					$(this).find(".add-component-below-button").show();
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").hide();
					$(this).find(".add-component-below-button").hide();
				}).mouseenter(function() {
					var parent = $(this).parents(".template-component-adder");
					parent.find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					parent.find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					parent.find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					parent.find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			}

			$scope.$on("templateEditModeOn", function() {
				$(element).addClass("task-component-adder");
				$(element).off();
				$(element).mouseover(function() {
					$(this).find(".edit-component-corner-button").show();
					$(this).find(".delete-component-corner-button").show();
					$(this).find(".add-component-above-button").show();
					$(this).find(".add-component-below-button").show();
				}).mouseleave(function() {
					$(this).find(".edit-component-corner-button").hide();
					$(this).find(".delete-component-corner-button").hide();
					$(this).find(".add-component-above-button").hide();
					$(this).find(".add-component-below-button").hide();
				}).mouseenter(function() {
					var parent = $(this).parents(".template-component-adder");
					parent.find(".edit-component-corner-button").not(".task-components .edit-component-corner-button").hide();
					parent.find(".delete-component-corner-button").not(".task-components .delete-component-corner-button").hide();
					parent.find(".add-component-above-button").not(".task-components .add-component-above-button").hide();
					parent.find(".add-component-below-button").not(".task-components .add-component-below-button").hide();
				});
			});

			$scope.$on("templateEditModeOff", function() {
				$(element).off();
				$(element).removeClass("task-component-adder");
			});

		}
	}
});