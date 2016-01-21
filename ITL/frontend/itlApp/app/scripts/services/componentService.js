var app = angular.module("itlApp");

app.service("componentService", [function() {
	this.convertBackToHTML = function(text) {
		var e = document.createElement('div');
	  	e.innerHTML = text;
	  	var ret = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	  	if (ret) {
	  		var e2 = document.createElement('div');
	  		$(e2).html(ret);
	  		$(e2).find("[style]").css("color", "");
	  		ret = $(e2).html();
	  	}
	  	return ret;
	};
	this.removeEscapedCharacters = function(text) {
		var e = document.createElement('div');
	  	e.innerHTML = text;
	  	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	};
	this.fixStatuses = function(statuses) {
		switch (statuses) {
			case 'Completed;Not Completed':
				statuses = 'Not Completed;Completed';
				break;
			case 'Not Applicable;Not Completed;Completed':
			case 'Not Applicable;Completed;Not Completed':
			case 'Not Completed;Completed;Not Applicable':
			case 'Completed;Not Completed;Not Applicable':
			case 'Completed;Not Applicable;Not Completed':
				statuses = 'Not Completed;Not Applicable;Completed';
				break;
			case 'Reviewed;Not Reviewed':
				statuses = 'Not Reviewed;Reviewed';
				break;
			case 'Reviewed;Not Applicable;Not Reviewed':
			case 'Not Applicable;Not Reviewed;Reviewed':
			case 'Not Applicable;Reviewed;Not Reviewed':
			case 'Not Reviewed;Reviewed;Not Applicable':
			case 'Reviewed;Not Reviewed;Not Applicable':
				statuses = 'Not Reviewed;Not Applicable;Reviewed';
				break;
		}
		return statuses;
	};
}]);