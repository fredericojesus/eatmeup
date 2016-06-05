(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state'];
    /*@ngInject*/
    function LoginController($scope, $state) {
        $scope.username = '';
        $scope.password = '';
        
        $scope.login = function () {
            console.log('login ' + $scope.username + ' (password: ' + $scope.password + ')');
            $state.go('main');
        };
    }

})();
