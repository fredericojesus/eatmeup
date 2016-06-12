(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', '$mdToast', 'authService'];
    /*@ngInject*/
    function AuthController($scope, $state, $mdToast, authService) {
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
                                showToast(err);
                            }
                        });
                    break;
                case 'signup':
                    authService.signupUser($scope.username, $scope.password)
                        .then(function () {
                            $state.go('main');
                        }).catch(function (err) {
                            if (err) {
                                showToast(err); 
                            }
                        });
                    break;
            }
        };

        function showToast(errorMessage) {
            var toast = $mdToast.simple()
                .textContent(errorMessage)
                .action('CLOSE')
                .highlightAction(true)
                .position('bottom')
                .hideDelay(3000);
            $mdToast.show(toast);
        }
    }

})();
