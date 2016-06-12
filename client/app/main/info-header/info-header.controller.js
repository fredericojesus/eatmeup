(function () {
    'use strict';
    
    angular.module('app.info-header')
        .controller('InfoHeaderController', InfoHeaderController);
        
    InfoHeaderController.$inject = ['$scope', 'authService'];
    /*@ngInject*/
    function InfoHeaderController($scope, authService) {
        authService.getCurrentUser()
            .then(function (user) {
                $scope.maximumCaloriesPerDay = user.maximumCaloriesPerDay;
            });
    }
})();