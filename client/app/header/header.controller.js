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

        $scope.openSettings = function (ev) {
            var dialogOptions = {
                controller: 'SettingsController',
                templateUrl: 'app/header/settings/settings.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            };

            $mdDialog.show(dialogOptions).then(function () {
                
            });
        };

        $scope.logout = function () {
            var confirm = $mdDialog.confirm()
                .title('Logout')
                .textContent('Are you sure you want to logout?')
                .ariaLabel('Logout')
                .targetEvent(originatorEv)
                .clickOutsideToClose(true)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    return authService.logout();
                })
                .then(function () {
                    $state.go('auth');
                });
        };
    }

})();