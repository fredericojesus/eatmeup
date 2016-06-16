(function () {
    'use strict';

    angular.module('app.header')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$rootScope', '$scope', '$mdDialog', 'toast', 'userShown', 'User'];
    /*@ngInject*/
    function SettingsController($rootScope, $scope, $mdDialog, toast, userShown, User) {
        $scope.user = userShown.getUserShown();                
        //prevent making duplicate calls
        var isSavingUser = false;

        //functions
        $scope.saveSettings = saveSettings;
        $scope.cancel = cancel;

        function saveSettings() {
            isSavingUser = true;

            var user = {};
            user._id = $scope.user._id;
            user.maximumCaloriesPerDay = $scope.user.maximumCaloriesPerDay;

            var updatedUser = new User();
            angular.extend(updatedUser, user);
            updatedUser.$update().then(processUpdatedUser, handleErrorSavingUser);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function processUpdatedUser(user) {
            $rootScope.$broadcast('userUpdated', user);
            $mdDialog.hide(user);
            isSavingUser = false;
        }

        function handleErrorSavingUser(err) {
            var message = 'Something went wrong when saving user. Please try again.';
            toast.showToast(message);
        }
    }
})();