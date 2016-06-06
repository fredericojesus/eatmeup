(function () {
    'use strict';

    angular
        .module('app')
        .config(configRoutes)
        .run(runRoutes);

    configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    /*@ngInject*/
    function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {
        var contentPath = 'app/';

        // Remove # from URL
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise('/');

        // States
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: contentPath + 'main/main.html',
                controller: 'MainController'
            })
            .state('auth', {
                url: '/auth',
                templateUrl: contentPath + 'auth/auth.html',
                controller: 'AuthController'
            });
    }

    runRoutes.$inject = ['$rootScope', '$state', 'authService'];
    /*@ngInject*/
    function runRoutes($rootScope, $state, authService) {
        $rootScope.$on('$stateChangeStart', stateChangeStartCallback);

        function stateChangeStartCallback(event, toState, toParams, fromState, fromParams, options) {
            //redirects the user to signup screen if not logged in
            if (toState.name !== 'auth') {
                authService.isAuthenticated()
                    .then(function () {
                        //user is logged in, do nothing
                    }).catch(function () {
                        event.preventDefault();
                        $state.go('auth');
                    });
            }
        }
    }

})();