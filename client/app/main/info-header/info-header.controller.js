(function () {
    'use strict';

    angular.module('app.info-header')
        .controller('InfoHeaderController', InfoHeaderController);

    InfoHeaderController.$inject = ['$scope', '$http', '$stateParams', 'authService', 'userShown'];
    /*@ngInject*/
    function InfoHeaderController($scope, $http, $stateParams, authService, userShown) {
        $scope.userShown = userShown.getUserShown();
        //show message User not found if isManager
        if (!$scope.userShown.username) {
            $scope.usernameParams = $stateParams.username;
        }
        $scope.maximumCaloriesPerDay = 0;
        $scope.todayCalories = 0;
        $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;

        //set today's consumed calories
        $http.get('/api/meals/todayCalories/' + $scope.userShown._id)
            .then(function (response) {
                $scope.todayCalories = response.data.totalCalories || 0;
            }).catch(function (response) {
                console.log(response);
            });

        //listeners
        $scope.$on('newMeal', function (ev, calories) {
            $scope.todayCalories += calories;
        });
        $scope.$on('deletedMeal', function (ev, calories) {
            $scope.todayCalories -= calories;
        });
        $scope.$on('userUpdated', function (ev, user) {
            $scope.userShown = user;
            $scope.userShown.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
        });
    }
})();