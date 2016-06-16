(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', 'authService', 'toast'];
    /*@ngInject*/
    function AuthController($scope, $state, authService, toast) {
        $scope.username = '';
        $scope.password = '';

        $scope.auth = function (type) {
            switch (type) {
                case 'login':
                    authService.authenticateUser($scope.username, $scope.password)
                        .then(function () {
                            $state.go('main');
                        }).catch(function (err) {
                            if (err) {
                                toast.showToast(err);
                            }
                        });
                    break;
                case 'signup':
                    authService.signupUser($scope.username, $scope.password)
                        .then(function () {
                            $state.go('main');
                        }).catch(function (err) {
                            if (err) {
                                toast.showToast(err); 
                            }
                        });
                    break;
            }
        };
    }

})();
