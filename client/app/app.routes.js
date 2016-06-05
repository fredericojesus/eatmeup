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
            .state('signup', {
                url: '/signup',
                templateUrl: contentPath + 'auth/signup.html',
                controller: 'SignUpController'
            })
            .state('login', {
                url: '/login',
                templateUrl: contentPath + 'auth/login.html',
                controller: 'LoginController'
            });
    }

    runRoutes.$inject = ['$rootScope', '$state', 'authService'];
    /*@ngInject*/
    function runRoutes($rootScope, $state, authService) {
        $rootScope.$on('$stateChangeStart', stateChangeStartCallback);

        function stateChangeStartCallback(event, toState, toParams, fromState, fromParams, options) {
            //redirects the user to signup screen if not logged in
            if (toState.name !== 'signup') {
                authService.isAuthenticated()
                    .then(function () {
                        
                    }).catch(function () {
                        event.preventDefault();
                        $state.go('signup');
                    });
            }
        }
    }

})();