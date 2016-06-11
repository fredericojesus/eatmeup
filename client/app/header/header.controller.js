(function () {
    'use strict';

    angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$scope', '$mdDialog', '$state', 'authService'];
    /*@ngInject*/
    function HeaderController($scope, $mdDialog, $state, authService) {
        $scope.authService = authService;

        var originatorEv;
        $scope.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.openSettings = function () {

        };

        $scope.logout = function () {
            var confirm = $mdDialog.confirm()
                .title('Logout')
                .textContent('Are you sure you want to logout?')
                .ariaLabel('Logout')
                .targetEvent(originatorEv)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    authService.logout();
                })
                .then(function () {
                    $state.go('auth');
                });
        };
    }

})();