(function () {
    'use strict';

    angular.module('app.main')
        .controller('AddEditMealController', AddEditMealController);

    AddEditMealController.$inject = ['$scope', '$mdDialog', '$mdToast', 'Meal', 'meal'];
    /*@ngInject*/
    function AddEditMealController($scope, $mdDialog, $mdToast, Meal, meal) {
        //if meal exists, we will edit that meal
        $scope.title = meal ? 'Edit Meal' : 'Add Meal';
        $scope.addEditText = meal ? 'Save' : 'Add';
        $scope.meal = meal ? meal.name : '';
        $scope.description = meal ? meal.description : '';
        $scope.calories = meal ? meal.calories : '';
        $scope.date = meal ? new Date(meal.date) : new Date();
        $scope.time = $scope.date.getHours();
        //prevent creating duplicate meals
        var isSavingMeal = false;

        //functions
        $scope.addEditMeal = addEditMeal;
        $scope.cancel = cancel;

        function addEditMeal() {
            if (isFormValidated() && !isSavingMeal) {
                isSavingMeal = true;

                var newMeal = {};
                newMeal.name = $scope.meal;
                newMeal.description = $scope.description;
                newMeal.calories = $scope.calories;
                newMeal.date = new Date(
                    $scope.date.getFullYear(),
                    $scope.date.getMonth(),
                    $scope.date.getDate()
                );
                newMeal.time = $scope.time;

                //edit
                if (meal) {
                    var editedMeal = new Meal();
                    newMeal._id = meal._id;
                    angular.extend(editedMeal, newMeal);
                    editedMeal.$update(newMeal).then(processSavedMeal, handleErrorSavingMeal);
                } 
                
                //create
                else {
                    Meal.save(newMeal).$promise.then(processSavedMeal, handleErrorSavingMeal);
                }
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function processSavedMeal(meal) {
            $mdDialog.hide(meal);
            isSavingMeal = false;
        }

        function handleErrorSavingMeal(err) {
            var message = 'Something went wrong when saving your meal. Please try again.';
            showToast(message);
            isSavingMeal = false;
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