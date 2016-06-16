(function () {
    'use strict';

    angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$scope', '$mdDialog', '$state', '$stateParams', 'authService'];
    /*@ngInject*/
    function HeaderController($scope, $mdDialog, $state, $stateParams, authService) {
        $scope.authService = authService;
        $scope.isManager = false;
        //originatorEv is used so that the close dialog animation animates towards button
        var originatorEv;
        
        //functions
        $scope.openMenu = openMenu;
        $scope.openSettings = openSettings;
        $scope.logout = logout;

        function openMenu($mdOpenMenu, ev) {
            $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;
            originatorEv = ev;
            $mdOpenMenu(ev);
        }

        function openSettings(ev) {
            var dialogOptions = {
                controller: 'SettingsController',
                templateUrl: 'app/header/settings/settings.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            };

            $mdDialog.show(dialogOptions).then(function () {
                
            });
        }

        function logout() {
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
        }
    }

})();