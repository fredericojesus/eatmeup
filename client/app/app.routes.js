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
                controller: 'MainController',
                resolve: {
                    isAuthorized: function () {
                        return true;
                    },
                    setUserShown: function (authService, userShown) {
                        return authService.getCurrentUser()
                            .then(function (user) {
                                return userShown.setUserShown(user);
                            }).catch(function () {
                                return false;
                            });
                    }
                }
            })
            .state('auth', {
                url: '/auth',
                templateUrl: contentPath + 'auth/auth.html',
                controller: 'AuthController'
            })
            .state('user', {
                url: '/:username',
                templateUrl: contentPath + 'main/main.html',
                controller: 'MainController',
                resolve: {
                    isAuthorized: function (authService) {
                        return authService.getCurrentUser()
                            .then(function () {
                                return authService.isAuthorized('manager');
                            }).catch(function () {
                                return false;
                            });
                    },
                    setUserShown: function ($stateParams, User, userShown, toast) {
                        User.get({username: $stateParams.username}).$promise
                            .then(function (user) {
                                return userShown.setUserShown(user);
                            }).catch(function (err) {
                                return false;
                            });
                    }
                }
            });
    }

    runRoutes.$inject = ['$rootScope', '$state', 'authService'];
    /*@ngInject*/
    function runRoutes($rootScope, $state, authService) {
        $rootScope.$on('$stateChangeStart', stateChangeStartCallback);

        function stateChangeStartCallback(event, toState, toParams, fromState, fromParams, options) {
            authService.getCurrentUser()
                //user is logged in
                .then(function () {
                    //redirects to / if user trying to access auth
                    if (toState.name === 'auth') {
                        event.preventDefault();
                        $state.go('main');
                    }
                    
                })
                //user is not logged in
                .catch(function () {
                    //redirects the user to signup screen if trying to access another page
                    if (toState.name !== 'auth') {
                        event.preventDefault();
                        $state.go('auth');
                    }
                });
        }
    }
})();