var app = angular.module('itlApp', ['ngRoute', 'textAngular', 'naif.base64', 'ngMessages', 'slick-angular-validation']).config(function($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
        taOptions.toolbar = [
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'insertLink']
        ];
        return taOptions;
    }]);
});

app.config(function($routeProvider) {
    if (resourceUrl === "{!$Resource.ITL_Resource}") {
        resourceUrl = "";
    }
});