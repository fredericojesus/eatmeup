(function () {
    'use strict';
    
    angular.module('app')
        .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', '$state', 'authService'];
    /*@ngInject*/
    function MainController($scope, $state, authService) {
        
        authService.getCurrentUser()
            .then(function (user) {
                $scope.currentUser = user;
            }).catch(function (error) {
                console.log(error);
            });
            
        $scope.logout = function () {
            authService.logout()
                .then(function () {
                    $state.go('signup');
                });
        };
    }
})();