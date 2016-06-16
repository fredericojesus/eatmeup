(function () {
    'use strict';

    angular.module('app.main')
        .controller('FilterController', FilterController);

    FilterController.$inject = ['$scope', '$mdDialog', '$stateParams', 'toast', 'authService'];
    /*@ngInject*/
    function FilterController($scope, $mdDialog, $stateParams, toast, authService) {
        $scope.mealType = '';
        $scope.mealTypes = {};
        $scope.dateFrom = undefined;
        $scope.dateTo = new Date();
        $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;
        $scope.subtitle = !$scope.isManager ? 'How much calories did I consume' : 'How much calories did ' + $stateParams.username + ' consume';

        //functions
        $scope.filterMeals = filterMeals;
        $scope.cancel = cancel;

        authService.getCurrentUser()
            .then(function (user) {
                $scope.mealType = user.mealTypes[0].type;
                $scope.mealTypes = user.mealTypes;
            });

        function filterMeals() {
            if (isFormValidated()) {
                var mealType = $scope.mealTypes.filter(function (mealType) {
                    return mealType.type === $scope.mealType;
                })[0];

                var filter = {
                    dateFrom: $scope.dateFrom,
                    dateTo: $scope.dateTo,
                    timeFrom: mealType.timeFrom,
                    timeTo: mealType.timeTo,
                    mealType: mealType.type
                };

                $mdDialog.hide(filter);
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function isFormValidated() {
            var errorMessage;

            if (!$scope.dateFrom) {
                errorMessage = 'Please enter date from';
            } else if (!$scope.dateTo) {
                errorMessage = 'Please enter date to';
            } else if (!$scope.mealType) {
                errorMessage = 'Please enter a meal type';
            }

            if (errorMessage) {
                toast.showToast(errorMessage);
                return false;
            }

            return true;
        }
    }

})();