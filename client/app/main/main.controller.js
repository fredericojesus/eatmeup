(function () {
    'use strict';
    
    angular.module('app')
        .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', '$state', 'authService'];
    /*@ngInject*/
    function MainController($scope, $state, authService) {
        $scope.delayTooltip = 500;
        
    }
    
})();