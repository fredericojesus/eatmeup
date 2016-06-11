(function () {
    'use strict';

    angular.module('app.main')
        .controller('AddMealController', AddMealController);

    AddMealController.$inject = ['$rootScope', '$scope', '$mdDialog', '$mdToast', 'Meal'];
    /*@ngInject*/
    function AddMealController($rootScope, $scope, $mdDialog, $mdToast, Meal) {
        $scope.meal;
        $scope.description;
        $scope.calories;
        $scope.date = new Date();
        var hours = $scope.date.getHours();
        $scope.time = hours > 12 ? hours - 12 : hours;
        $scope.amPm = hours > 12 ? 'pm' : 'am';
        //prevent creating duplicate meals
        var isSavingMeal = false;

        $scope.addMeal = function () {
            if (isFormValidated() && !isSavingMeal) {
                isSavingMeal = true;

                var newMeal = {};
                newMeal.name = $scope.meal;
                newMeal.description = $scope.description;
                newMeal.calories = $scope.calories;
                newMeal.date = new Date(
                    $scope.date.getFullYear(),
                    $scope.date.getMonth(),
                    $scope.date.getDate(),
                    $scope.time, 0, 0
                );

                Meal.save(newMeal).$promise.then(processNewMeal, handleErrorCreatingMeal);
            }
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        function processNewMeal(newMeal) {
            $mdDialog.hide();
            isSavingMeal = false;

            $rootScope.$broadcast('newMeal', newMeal);
        }

        function handleErrorCreatingMeal(err) {
            var message = 'Something went wrong saving your meal. Please try again.';
            showToast(message);
        }

        function isFormValidated() {
            var errorMessage;

            if (!$scope.meal) {
                errorMessage = 'Please enter your meal name';
            } else if (!$scope.description) {
                errorMessage = 'Please enter a description for your meal';
            } else if (!$scope.calories) {
                errorMessage = 'Please enter the calories of your meal';
            } else if (!$scope.date) {
                errorMessage = 'Please enter the date you have eaten your meal';
            } else if (!$scope.time) {
                errorMessage = 'Please enter the time you have eaten your meal';
            }

            if (errorMessage) {
                showToast(errorMessage);
                return false;
            }

            return true;
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