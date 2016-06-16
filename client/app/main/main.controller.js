(function () {
    'use strict';

    angular.module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$mdDialog', 'Meal', 'authService', 'userShown', 'isAuthorized'];
    /*@ngInject*/
    function MainController($rootScope, $scope, $state, $stateParams, $mdDialog, Meal, authService, userShown, isAuthorized) {
        if (!isAuthorized) {
            return $state.go('main');
        }
        
        $scope.delayTooltip = 500;
        $scope.mealsList = [];
        $scope.isFilterApplied = false;
        $scope.filterTitle = '';
        $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;
        $scope.userNotFound = $scope.isManager && (!userShown.getUserShown().username) ? true : false; 

        //functions
        $scope.addEditMeal = addEditMeal;
        $scope.deleteMeal = deleteMeal;
        $scope.filterMeals = filterMeals;
        $scope.cancelFilter = cancelFilter;

        getMeals();

        /**
         * @param {Date} dateFrom
         * @param {Date} dateTo
         * @param {Number} timeFrom
         * @param {Number} timeTo
         */
        function getMeals(dateFrom, dateTo, timeFrom, timeTo) {
            Meal.query({
                userId: userShown.getUserShown()._id,
                dateFrom: dateFrom,
                dateTo: dateTo,
                timeFrom: timeFrom,
                timeTo: timeTo
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

            $mdDialog.show(dialogOptions).then(function (filter) {
                $scope.isFilterApplied = true;
                $scope.filterTitle = 'Meals from ' + filter.dateFrom.toLocaleDateString() + ' to ' + filter.dateTo.toLocaleDateString() + ' at ' + filter.mealType;
                $scope.mealsList = [];
                getMeals(filter.dateFrom, filter.dateTo, filter.timeFrom, filter.timeTo);
            });
        }

        function cancelFilter() {
            $scope.isFilterApplied = false;
            $scope.mealsList = [];
            getMeals();
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