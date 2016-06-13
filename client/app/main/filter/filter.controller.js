(function () {
    'use strict';

    angular.module('app.main')
        .controller('FilterController', FilterController);

    FilterController.$inject = ['$scope', '$mdDialog', 'authService'];
    /*@ngInject*/
    function FilterController($scope, $mdDialog, authService) {
        $scope.mealType;
        $scope.mealTypes;

        //functions
        $scope.filterMeals = filterMeals;
        $scope.cancel = cancel;

        authService.getCurrentUser()
            .then(function (user) {
                $scope.mealTypes = user.mealTypes;
                $scope.mealType = user.mealTypes[0].type;
            });

        function filterMeals() {

        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

})();