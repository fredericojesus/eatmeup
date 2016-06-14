(function () {
    'use strict';

    angular.module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$rootScope', '$scope', '$state', '$mdDialog', '$mdMedia', 'authService', 'Meal', 'isAuthorized'];
    /*@ngInject*/
    function MainController($rootScope, $scope, $state, $mdDialog, $mdMedia, authService, Meal, isAuthorized) {
        if (!isAuthorized) {
            return $state.go('main');
        }

        $scope.delayTooltip = 500;
        $scope.mealsList = [];

        //functions
        $scope.addEditMeal = addEditMeal;
        $scope.deleteMeal = deleteMeal;
        $scope.filterMeals = filterMeals;

        getMeals();

        function getMeals() {
            Meal.query({

            }).$promise.then(function (meals) {
                $scope.mealsList = meals;
            });
        }

        /**
         * @param {Event} ev
         * @param {Number} index - when editing index is needed to update meal
         * @param {Object} meal - when edited the object meal is used to pass to the controller
         */
        function addEditMeal(ev, index, meal) {
            var dialogOptions = {
                controller: 'AddEditMealController',
                templateUrl: 'app/main/add-edit-meal/add-edit-meal.html',
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
                    meal.$delete().then(function () {
                        if (isMealEatenToday(meal)) {
                            //warn info-head that a new meal has been deleted
                            $rootScope.$broadcast('deletedMeal', meal.calories);
                        }
                    });
                })
                .then(function () {
                    $scope.mealsList.splice(index, 1);
                });
        }

        function filterMeals(ev) {
            var dialogOptions = {
                controller: 'FilterController',
                templateUrl: 'app/main/filter/filter.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            };

            $mdDialog.show(dialogOptions).then(function () {

            });
        }
        
        function newMealHandler(newMeal) {
            var meal = new Meal();
            angular.extend(meal, newMeal);
            $scope.mealsList.unshift(meal);

            if (isMealEatenToday(meal)) {
                //warn info-head there's a new meal
                $rootScope.$broadcast('newMeal', meal.calories);
            }
        }


        function isMealEatenToday(meal) {
            var dateNow = new Date();
            var dateMeal = new Date(meal.date);

            if (dateNow.getDate() === dateMeal.getDate()) {
                return true;
            }

            return false;
        }
    }
})();