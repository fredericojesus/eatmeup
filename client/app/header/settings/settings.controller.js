(function () {
    'use strict';

    angular.module('app.header')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$mdDialog', '$mdToast', 'authService', 'User'];
    /*@ngInject*/
    function SettingsController($scope, $mdDialog, $mdToast, authService, User) {
        $scope.user = {};
        $scope.maximumCaloriesPerDay = 0;
        $scope.mealTypes = {};
        //prevent making duplicate calls
        var isSavingUser = false;

        //functions
        $scope.saveSettings = saveSettings;
        $scope.cancel = cancel;

        authService.getCurrentUser()
            .then(function (user) {
                $scope.user = user;
                $scope.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
                $scope.mealTypes = user.mealTypes;
            });

        function saveSettings() {
            isSavingUser = true;

            var user = {};
            user._id = $scope.user._id;
            user.maximumCaloriesPerDay = $scope.maximumCaloriesPerDay;

            var updatedUser = new User();
            angular.extend(updatedUser, user);
            updatedUser.$update().then(processUpdatedUser, handleErrorSavingUser);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function processUpdatedUser(user) {
            $mdDialog.hide(user);
            isSavingUser = false;
        }

        function handleErrorSavingUser(err) {
            var message = 'Something went wrong when saving user. Please try again.';
            showToast(message);
        }

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