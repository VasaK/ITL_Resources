var app = angular.module('itlApp');

app.controller('noteModalController', ['$scope', function($scope) {
	$scope.displayCreateNoteModal = false;
	$scope.displayViewNoteModal = false;
	$scope.displayAppendNoteModal = false;
	$scope.displayCreateIssueModal = false;
	$scope.canCreateNotes = false;
	$scope.createNoteModalTemplate = resourceUrl + '/partials/createNoteModal.html';
	$scope.appendNoteModalTemplate = resourceUrl + '/partials/appendNoteModal.html';
	$scope.createIssueModalTemplate = resourceUrl + '/partials/createIssueModal.html';
	$scope.xlinkHelper = {
		close : resourceUrl + "/icons/action-sprite/svg/symbols.svg#close"
	};
	$scope.noteWrapper = {};

	$scope.switchTab = function(tabName) {
		$(".slds-tabs__item").removeClass("slds-active");
		$(".slds-tabs__content").removeClass("slds-show");
		$(".slds-tabs__content").addClass("slds-hide");
		$("#" + tabName + "--tab").addClass("slds-active");
		$("#" + tabName + "--panel").removeClass("slds-hide");
		$("#" + tabName + "--panel").addClass("slds-show");
	};

	$scope.hideAllModals = function() {
		$scope.displayCreateNoteModal = false;
		$scope.displayViewNoteModal = false;
		$scope.displayAppendNoteModal = false;
		$scope.displayCreateIssueModal = false;
	};

	$scope.$on('createNoteModal-broadcast', function(event, values) {
		$scope.hideAllModals();
		$scope.displayCreateNoteModal = true;
	});

	$scope.$on('viewNoteModal-broadcast', function(event, values) {
		$scope.hideAllModals();
		$scope.noteWrapper = values.noteWrapper;
		$scope.canCreateNotes = values.canCreateNotes;
		$scope.displayViewNoteModal = true;
		$scope.switchTab('note-text');
	});

	$scope.$on('cancelNoteModal-emit', function(event, values) {
		$scope.hideAllModals();
		$scope.displayViewNoteModal = true;
	});

	$scope.closeModal = function() {
		$scope.hideAllModals();
		$scope.noteWrapper = {};
		$scope.$emit('closeNoteModal-emit');
	};

	$scope.appendNoteModal = function() {
		$scope.hideAllModals();
		$scope.displayAppendNoteModal = true;
		$scope.$broadcast('appendNoteModal-broadcast', {
			noteWrapper : $scope.noteWrapper
		});
	};

	$scope.createIssueModal = function() {
		$scope.hideAllModals();
		$scope.displayCreateIssueModal = true;
		$scope.$broadcast('createIssueModal-broadcast', {
			noteWrapper : $scope.noteWrapper
		});
	};

}]);