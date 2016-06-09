(function() {
    'use strict';

    angular
        .module('app.content')
        .directive('content', content);

    function content() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/content/content.html',
            controller: 'ContentController'
        };
    }

})();