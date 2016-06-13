(function () {
    'use strict';

    angular.module('app.info-header')
        .controller('InfoHeaderController', InfoHeaderController);

    InfoHeaderController.$inject = ['$scope', '$http', 'authService'];
    /*@ngInject*/
    function InfoHeaderController($scope, $http, authService) {
        authService.getCurrentUser()
            .then(function (user) {
                $scope.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
            });

        $http.get('/api/meals/todayCalories')
            .then(function (response) {
                $scope.todayCalories = response.data.totalCalories;
            }).catch(function (response) {
                console.log(response);
            });
    }
})();