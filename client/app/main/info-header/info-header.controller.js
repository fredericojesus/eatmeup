(function () {
    'use strict';

    angular.module('app.info-header')
        .controller('InfoHeaderController', InfoHeaderController);

    InfoHeaderController.$inject = ['$scope', '$http', 'authService'];
    /*@ngInject*/
    function InfoHeaderController($scope, $http, authService) {
        $scope.maximumCaloriesPerDay = 0;
        $scope.todayCalories = 0;

        //listeners
        $scope.$on('newMeal', function (ev, calories) {
            $scope.todayCalories += calories;
        });
        $scope.$on('deletedMeal', function (ev, calories) {
            $scope.todayCalories -= calories;
        });

        //set maximumCaloriesPerDay
        authService.getCurrentUser()
            .then(function (user) {
                $scope.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
            });

        //set today's consumed calories
        $http.get('/api/meals/todayCalories')
            .then(function (response) {
                $scope.todayCalories = response.data.totalCalories || 0;
            }).catch(function (response) {
                console.log(response);
            });
    }
})();