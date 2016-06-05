(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['$scope', '$state', 'authService'];
    /*@ngInject*/
    function SignUpController($scope, $state, authService) {
        $scope.username = '';
        $scope.password = '';
        
        $scope.signup = function () {
            authService.signupUser($scope.username, $scope.password)
                .then(function () {
                    $state.go('main');
                }).catch(function (err) {
                    console.log(err);
                });
        };
    }

})();
