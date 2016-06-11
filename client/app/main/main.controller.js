(function () {
    'use strict';

    angular.module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$state', '$mdDialog', '$mdMedia', 'authService', 'Meal'];
    /*@ngInject*/
    function MainController($scope, $state, $mdDialog, $mdMedia, authService, Meal) {
        $scope.delayTooltip = 500;
        $scope.mealsList = [];

        //functions
        $scope.addMeal = addMeal;
        
        //listeners
        $scope.$on('newMeal', newMealHandler);

        getMeals();

        function getMeals() {
            Meal.query({

            }).$promise.then(function (meals) {
                $scope.mealsList = meals;
            });
        }

        function addMeal(ev) {
            var dialogOptions = {
                controller: 'AddMealController',
                templateUrl: 'app/main/add-meal/add-meal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $mdMedia('xs')
            };

            $mdDialog.show(dialogOptions).then(function (meal) {
                console.log('Meal: ' + meal);
            });
        };

        function newMealHandler(ev, newMeal) {
            var meal = new Meal();
            angular.extend(meal, newMeal);
            $scope.mealsList.unshift(meal);
        }
    }

})();