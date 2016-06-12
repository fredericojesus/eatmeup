(function () {
    'use strict';

    angular.module('app.header')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$mdDialog', 'authService'];
    /*@ngInject*/
    function SettingsController($scope, $mdDialog, authService) {
        authService.getCurrentUser()
            .then(function (user) {
                $scope.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
                $scope.mealTypes = user.mealTypes;
            });

        //functions
        $scope.saveSettings = saveSettings;
        $scope.cancel = cancel;

        function saveSettings() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();