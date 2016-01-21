var app = angular.module('itlApp');

app.controller('createNoteModalController', ['$scope', function($scope) {
	$scope.noteReasonOptionsTemplate = resourceUrl + '/partials/noteReasonOptions.html';
	$scope.xlinkHelper = {
		search : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#search",
		down : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#down",
		contact : resourceUrl + "/icons/standard-sprite/svg/symbols.svg#contact",
		close : resourceUrl + "/icons/utility-sprite/svg/symbols.svg#close"
	};
	$scope.displayContactLabel = false;
	$scope.displayContactValue = true;
	$scope.contactName = '';
	$scope.contactSearch = '';
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
		Subject__c : {
			message : 'Subject is required'
		},
		Reason__c : {
			message : 'Reason is required'
		},
		Expire_on__c : {
			message : 'Date must be in the future'
		},
		Contact__c : {
			message : 'Please select a valid contact from the list.'
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

	$scope.$on('createNoteModal-broadcast', function(event, values) {
		$scope.clearValidation();
		$scope.displayContactLabel = false;
		$scope.displayContactValue = true;
		$scope.contactName = '';
		$scope.contactSearch = '';
		$scope.noteWrapper = {
			note : {}
		};
		$scope.textWrapper = {
			text : {}
		};
		$scope.taskId = values.taskId;
		$scope.noteWrapper.note.Installation_Task__c = values.taskId;
	});

	$scope.$on('contactSelected-emit', function(event, values) {
		$scope.displayContactValue = false;
		$scope.displayContactLabel = true;
		$scope.contactName = values.item.label;
		$scope.noteWrapper.note.Company__c = values.item.accountId;
		$scope.noteWrapper.note.Contact__c = values.item.valueId;
		$scope.contactSearch = '';
	});

	$scope.clearValidation = function() {
		_.each(_.values($scope.formValidator), function(valObj) {
			delete valObj.error;
		});
	};

	$scope.validateForm = function() {
		$scope.clearValidation();

		$scope.formValidator.Subject__c.error = _.isEmpty($scope.noteWrapper.note.Subject__c);
		$scope.formValidator.Reason__c.error = _.isEmpty($scope.noteWrapper.note.Reason__c);
		if ($scope.noteWrapper.note.Expire_on__c) {
			var d_today = new Date();
			var dateString = (d_today.getUTCMonth() + 1) + '/' + d_today.getUTCDate() + '/' + d_today.getUTCFullYear();
			if (!$scope.noteWrapper.note.Expire_on__c.match(/^((1[0-2])|(0[1-9])|([1-9]))\/((3[0-1])|([1-2][0-9])|(0[1-9])|([1-9]))\/(\d{4})$/g)) {
				$scope.formValidator.Expire_on__c.error = true;
				$scope.formValidator.Expire_on__c.message = 'Invalid MM/DD/YYYY date';
			} else {
				var expireOn = new Date($scope.noteWrapper.note.Expire_on__c + ' 00:00:00 GMT');
				if (_.isDate(expireOn)) {
					$scope.formValidator.Expire_on__c.error = (new Date(dateString + ' 00:00:00 GMT')) > expireOn;
					$scope.formValidator.Expire_on__c.message = 'Date must be in the future'
				} else {
					$scope.formValidator.Expire_on__c.error = true;
					$scope.formValidator.Expire_on__c.message = 'Invalid MM/DD/YYYY date';
				}
			}
		}
		$scope.formValidator.Contact__c.error = !_.isEmpty($scope.contactSearch) && _.isEmpty($scope.noteWrapper.note.Contact__c);
		$scope.formValidator.Type__c.error = _.isEmpty($scope.textWrapper.text.Type__c);
		$scope.formValidator.Notes_Text_Score__c.error = _.isEmpty($scope.textWrapper.text.Notes_Text_Score__c);
		$scope.formValidator.Notes__c.error = _.isEmpty($scope.textWrapper.text.Notes__c);

		var errors = _.where(_.values($scope.formValidator), {error:true});
		return errors.length == 0;
	};

	$scope.saveNote = function() {
		if ($scope.validateForm()) {
			if (!$scope.noteWrapper.note.Expire_on__c) {
				delete $scope.noteWrapper.note.Expire_on__c;
			}
			$scope.$emit('createNoteAndText-emit', {
				taskId : $scope.taskId,
				noteWrapper : $scope.noteWrapper,
				textWrapper : $scope.textWrapper
			});
		}
	};

	$scope.cancel = function() {
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.clearContact = function() {
		$scope.displayContactValue = true;
		$scope.displayContactLabel = false;
		$scope.contactName = '';
		$scope.contactSearch = '';
		$scope.noteWrapper.note.Contact__c = '';
		$scope.noteWrapper.note.Company__c = '';
	};

	$scope.$watch('noteWrapper.note.Use_Warning__c', function(newValue, oldValue) {
		if (!newValue) {
			delete $scope.noteWrapper.note.Expire_on__c;
		}
	});

	$scope.$watch('contactSearch', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});

	$scope.$watchCollection('noteWrapper.note', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});

	$scope.$watchCollection('textWrapper.text', function() {
		var errors = _.where(_.values($scope.formValidator), {error:true});
		if (errors.length > 0) {
			$scope.validateForm();
		}
	});
}]);