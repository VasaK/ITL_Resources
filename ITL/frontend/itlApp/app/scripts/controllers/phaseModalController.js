var app = angular.module("itlApp");

app.controller("phaseModalController", ["$scope", "componentService", function($scope, componentService) {
	$scope.modalPhase = {};
	$scope.formValidator = {
		form: {
			message: 'An error occurred. Please try again.'
		},
		Phase_Name__c: {
			message: 'Name is required'
		}
	};

	$scope.$on("phaseCreate-broadcast", function() {
		$scope.modalPhase = {};
		$scope.clearValidation();
	});

	$scope.$on("phaseEdited-broadcast", function(event, values) {
		$scope.modalPhase = values.phase;
		$scope.modalPhase.Phase_Name__c = componentService.removeEscapedCharacters($scope.modalPhase.Phase_Name__c);
		$scope.clearValidation();
	});

	$scope.$on("phaseModal-displayError", function(event, values) {
		$scope.displayRemoteError(values.message);
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();
		$scope.formValidator.Phase_Name__c.error = _.isEmpty($scope.modalPhase.Phase_Name__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length > 0;
	};

	$scope.handleSaveModalPhase = function() {
		if (!$scope.validateForm()) {
			$scope.saveModalPhase();
		}
	};

	$scope.displayRemoteError = function(message) {
		$scope.formValidator.form.message = 'An error occurred. Please try again.';
		if (message) {
			$scope.formValidator.form.message = message;
		}
		$scope.formValidator.form.error = true;
		$scope.helper.formReady = true;
	};

	$scope.saveModalPhase = function() {
		if ($scope.modalPhase.Id) {
			$scope.$emit("saveModalPhase", {
				phase: $scope.modalPhase
			});
		} else {
			$scope.$emit("createModalPhase", {
				phase: $scope.modalPhase
			});
		}
	};

	$scope.cancelModalPhase = function() {
		$scope.modalPhase = {};
		$scope.$emit("cancelModalPhase");
	};

}]);