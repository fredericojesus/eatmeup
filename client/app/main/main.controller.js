(function () {
    'use strict';

    angular.module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$state', '$mdDialog', '$mdMedia', 'authService', 'Meal', 'isAuthorized'];
    /*@ngInject*/
    function MainController($scope, $state, $mdDialog, $mdMedia, authService, Meal, isAuthorized) {
        if (!isAuthorized) {
            return $state.go('main');
        }
        
        $scope.delayTooltip = 500;
        $scope.mealsList = [];

        //functions
        $scope.addEditMeal = addEditMeal;
        $scope.deleteMeal = deleteMeal;

        getMeals();

        function getMeals() {
            Meal.query({

            }).$promise.then(function (meals) {
                $scope.mealsList = meals;
            });
        }

        function addEditMeal(ev, index, meal) {
            var dialogOptions = {
                controller: 'AddMealController',
                templateUrl: 'app/main/add-meal/add-meal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    meal: meal
                }
            };

            $mdDialog.show(dialogOptions).then(function (newEditedMeal) {
                console.log('Meal: ' + newEditedMeal);
                //edited
                if (meal) {
                    $scope.mealsList[index] = newEditedMeal;
                } 
                
                //created
                else {
                    newMealHandler(newEditedMeal);
                }
            });
        }

        function deleteMeal(ev, index, meal) {
            var confirm = $mdDialog.confirm()
                .title('Delete Meal')
                .textContent('Are you sure you want to delete this meal?')
                .ariaLabel('Delete Meal')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    meal.$delete();
                })
                .then(function () {
                    $scope.mealsList.splice(index, 1);
                });
        }

        function newMealHandler(newMeal) {
            var meal = new Meal();
            angular.extend(meal, newMeal);
            $scope.mealsList.unshift(meal);
        }
    }

})();