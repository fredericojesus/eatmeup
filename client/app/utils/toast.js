(function () {
    'use strict';

    angular
        .module('app.utils', [])
        .factory('toast', toast);

    toast.$inject = ['$mdToast'];
    /*@ngInject*/
    function toast($mdToast) {

        var service = {
            showToast: showToast
        };

        return service;

        function showToast(message) {
            var toast = $mdToast.simple()
                .textContent(message)
                .action('CLOSE')
                .highlightAction(true)
                .position('bottom')
                .hideDelay(3000);
            $mdToast.show(toast);
        }
    }

})();