var app = angular.module("itlApp");

app.directive('contactLookup', ["$window", function($window) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            var renderItem = function(ul, item) {
                var liHTML = '<a id="' + item.valueId + '" role="option">'
                            + '<svg aria-hidden="true" class="slds-icon slds-icon-standard-account slds-icon--small ie-contact-icon">'
                            + '<use xlink:href="' + resourceUrl + '/icons/standard-sprite/svg/symbols.svg#contact"></use>'
                            + '</svg>' + item.label + '</a>';
                return $('<li>').addClass('slds-lookup__item').append(liHTML).appendTo(ul);
            };

            var renderMenu = function(ul, items) {
                $(ul).addClass('slds-lookup__list contact-lookup-menu');
                _.each(items, function(item) {
                    this._renderItemData(ul, item);
                }, this);
            };

        	$(element).autocomplete({
        		source: $scope.contactOptions,
        		select: function(event, ui) {
                    $scope.$apply(function() {
            			$scope.$emit('contactSelected-emit', {
            				item: ui.item
            			});
                    });
                    event.preventDefault();
        		},
                minLength: 0,
                appendTo: $(element).parent()
        	});

            $(element).autocomplete("instance")._renderItem = renderItem;
            $(element).autocomplete("instance")._renderMenu = renderMenu;

            $(element).prevAll('.slds-input__icon').click(function() {
                $(element).autocomplete( "search", "" );
            });

            //$(element).attr('autocomplete', 'on');
            
        }
    }
}]);