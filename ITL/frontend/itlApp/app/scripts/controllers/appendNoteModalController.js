var app = angular.module('itlApp');

app.controller('appendNoteModalController', ['$scope', function($scope) {
	$scope.noteWrapper = {
		note : {}
	};
	$scope.textWrapper = {
		text : {}
	};
	$scope.formValidator = {
		form : {
			message : 'An error occurred. Please try again.'
		},
		Type__c : {
			message : 'Type is required'
		},
		Notes_Text_Score__c : {
			message : 'Score is required'
		},
		Notes__c : {
			message : 'Notes is required'
		}
	};

	$scope.$on('appendNoteModal-broadcast', function(event, values) {
		$scope.clearValidation();
		$scope.noteWrapper = {
			note : {}
		};
		$scope.textWrapper = {
			text : {}
		};
		$scope.noteWrapper = values.noteWrapper;
		$scope.taskId = $scope.noteWrapper.note.Installation_Task__c;
		$scope.textWrapper.text.Plan_Notes__c = $scope.noteWrapper.note.Id;
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();

		$scope.formValidator.Type__c.error = _.isEmpty($scope.textWrapper.text.Type__c);
		$scope.formValidator.Notes_Text_Score__c.error = _.isEmpty($scope.textWrapper.text.Notes_Text_Score__c);
		$scope.formValidator.Notes__c.error = _.isEmpty($scope.textWrapper.text.Notes__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length == 0;
	};

	$scope.saveText = function() {
		if ($scope.validateForm()) {
			$scope.$emit('createText-emit', {
				taskId : $scope.taskId,
				textWrapper : $scope.textWrapper
			});
		}
	};

	$scope.cancel = function() {
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.$watchCollection('textWrapper.text', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});
}]);